import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { verifyPassword, createSession, checkRateLimitAndLock, handleFailedLogin, handleSuccessfulLogin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Nama pengguna dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    // Check lock status
    const lockStatus = await checkRateLimitAndLock();
    if (lockStatus.isLocked) {
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          message: `Terlalu banyak percobaan. Coba lagi dalam ${lockStatus.remainingMinutes || 15} menit.`,
        },
        { status: 429 }
      );
    }

    const db = getDb();
    const res = await db.execute({
      sql: 'SELECT id, username, nama, password_hash FROM users WHERE username = ? LIMIT 1',
      args: [username],
    });

    if (res.rows.length === 0) {
      const lockCheck = await handleFailedLogin();
      return NextResponse.json(
        {
          success: false,
          isLocked: lockCheck.lockedNow,
          message: lockCheck.lockedNow
            ? 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.'
            : 'Nama pengguna atau kata sandi salah.',
        },
        { status: 401 }
      );
    }

    const user = res.rows[0];
    const passwordMatch = await verifyPassword(password, user.password_hash as string);

    if (!passwordMatch) {
      const lockCheck = await handleFailedLogin();
      return NextResponse.json(
        {
          success: false,
          isLocked: lockCheck.lockedNow,
          message: lockCheck.lockedNow
            ? 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.'
            : 'Nama pengguna atau kata sandi salah.',
        },
        { status: 401 }
      );
    }

    // Successful login
    const userId = Number(user.id);
    await handleSuccessfulLogin(userId);
    await createSession({
      id: userId,
      username: user.username as string,
      nama: user.nama as string,
    });

    await logAudit('ubah', 'Auth', userId, 'Super admin berhasil masuk ke dashboard');

    return NextResponse.json({
      success: true,
      message: 'Berhasil masuk ke dashboard',
      user: {
        id: userId,
        username: user.username,
        nama: user.nama,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada sistem' }, { status: 500 });
  }
}
