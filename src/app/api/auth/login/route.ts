import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import {
  verifyPassword,
  createSession,
  checkRateLimitAndLock,
  handleFailedLogin,
  handleSuccessfulLogin,
  DUMMY_HASH,
} from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp, checkIpRateLimit, recordIpFailedAttempt, resetIpRateLimit } from '@/lib/rateLimit';
import { validateUsername, validatePassword } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. Lapisan Pertama: IP-Based Rate Limiting (Mencegah Brute Force & Credential Stuffing)
    const ipLimit = checkIpRateLimit(clientIp);
    if (ipLimit.isLimited) {
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          message: ipLimit.message || 'Terlalu banyak permintaan. Silakan tunggu sebelum mencoba lagi.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              ipLimit.remainingSeconds || (ipLimit.remainingMinutes ? ipLimit.remainingMinutes * 60 : 60)
            ),
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      recordIpFailedAttempt(clientIp);
      return NextResponse.json(
        { success: false, message: 'Format data permintaan tidak valid' },
        { status: 400 }
      );
    }

    const { username, password } = body;

    // 2. Lapisan Kedua: Validasi Ketat & Deteksi SQL Injection pada Input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid || !usernameValidation.cleanUsername) {
      recordIpFailedAttempt(clientIp);
      await logAudit(
        'ubah',
        'Keamanan',
        undefined,
        `[BLOKIR KEAMANAN] Percobaan login ditolak: ${usernameValidation.error} dari IP: ${clientIp}`
      );
      return NextResponse.json(
        {
          success: false,
          message: usernameValidation.error || 'Nama pengguna tidak valid atau mengandung karakter dilarang.',
        },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      recordIpFailedAttempt(clientIp);
      await logAudit(
        'ubah',
        'Keamanan',
        undefined,
        `[BLOKIR KEAMANAN] Format kata sandi tidak valid atau terdeteksi ancaman dari IP: ${clientIp}`
      );
      return NextResponse.json(
        {
          success: false,
          message: passwordValidation.error || 'Kata sandi tidak valid.',
        },
        { status: 400 }
      );
    }

    const cleanUsername = usernameValidation.cleanUsername;

    // 3. Lapisan Ketiga: Pengecekan Kunci Akun Pengguna Spesifik (Targeted Lockout)
    await initDb();
    const accountLock = await checkRateLimitAndLock(cleanUsername);
    if (accountLock.isLocked) {
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          message: `Akun ini terkunci sementara karena terlalu banyak percobaan salah. Coba lagi dalam ${
            accountLock.remainingMinutes || 15
          } menit.`,
        },
        {
          status: 429,
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // 4. Lapisan Keempat: Eksekusi Query Parameterized (Kekebalan Mutlak Terhadap SQL Injection)
    const db = getDb();
    const res = await db.execute({
      sql: 'SELECT id, username, nama, password_hash FROM users WHERE username = ? LIMIT 1',
      args: [cleanUsername],
    });

    // 5. Lapisan Kelima: Proteksi Timing Attack (Constant-Time Verification)
    if (res.rows.length === 0) {
      // Jalankan verifikasi dummy agar waktu komputasi identik dan tidak membocorkan eksistensi user
      await verifyPassword(password, DUMMY_HASH);
      recordIpFailedAttempt(clientIp);
      const lockStatus = await handleFailedLogin(cleanUsername);

      await logAudit(
        'ubah',
        'Keamanan',
        undefined,
        `Percobaan login gagal: nama pengguna '${cleanUsername}' tidak ditemukan dari IP: ${clientIp}`
      );

      return NextResponse.json(
        {
          success: false,
          isLocked: lockStatus.lockedNow,
          message: lockStatus.lockedNow
            ? 'Terlalu banyak percobaan gagal. Akun diamankan selama 15 menit.'
            : 'Nama pengguna atau kata sandi salah.',
        },
        { status: 401 }
      );
    }

    const user = res.rows[0];
    const passwordMatch = await verifyPassword(password, user.password_hash as string);

    if (!passwordMatch) {
      recordIpFailedAttempt(clientIp);
      const lockStatus = await handleFailedLogin(cleanUsername);

      await logAudit(
        'ubah',
        'Keamanan',
        Number(user.id),
        `Percobaan login gagal: kata sandi salah untuk user '${cleanUsername}' dari IP: ${clientIp}`
      );

      return NextResponse.json(
        {
          success: false,
          isLocked: lockStatus.lockedNow,
          message: lockStatus.lockedNow
            ? 'Terlalu banyak percobaan gagal. Akun diamankan selama 15 menit.'
            : 'Nama pengguna atau kata sandi salah.',
        },
        { status: 401 }
      );
    }

    // 6. Login Berhasil: Reset Rate Limit IP & Akun, Buat Sesi JWT
    const userId = Number(user.id);
    resetIpRateLimit(clientIp);
    await handleSuccessfulLogin(userId);

    const token = await createSession({
      id: userId,
      username: user.username as string,
      nama: user.nama as string,
    });

    await logAudit(
      'ubah',
      'Auth',
      userId,
      `Super admin '${cleanUsername}' berhasil masuk ke dashboard dari IP: ${clientIp}`
    );

    const response = NextResponse.json({
      success: true,
      message: 'Berhasil masuk ke dashboard',
      user: {
        id: userId,
        username: user.username,
        nama: user.nama,
      },
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60,
      path: '/',
    });

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada sistem' }, { status: 500 });
  }
}
