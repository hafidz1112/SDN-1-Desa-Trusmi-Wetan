import { NextRequest, NextResponse } from 'next/server';
import { getSession, verifyPassword, hashPassword } from '@/lib/auth';
import { getDb, initDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { containsSqlInjection, validatePassword } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Format data tidak valid' }, { status: 400 });
    }

    const { old_password, new_password, confirm_password } = body;

    if (!old_password || !new_password || !confirm_password) {
      return NextResponse.json({ success: false, message: 'Semua kolom kata sandi wajib diisi' }, { status: 400 });
    }

    if (containsSqlInjection(old_password) || containsSqlInjection(new_password) || containsSqlInjection(confirm_password)) {
      return NextResponse.json({ success: false, message: 'Pola tidak sah terdeteksi pada input' }, { status: 400 });
    }

    const newPwdValidation = validatePassword(new_password);
    if (!newPwdValidation.isValid) {
      return NextResponse.json({ success: false, message: newPwdValidation.error || 'Format kata sandi baru tidak valid' }, { status: 400 });
    }

    if (new_password !== confirm_password) {
      return NextResponse.json({ success: false, message: 'Konfirmasi kata sandi tidak cocok' }, { status: 400 });
    }

    // Rules: >= 8 characters, letters & numbers (FR-ADM-008)
    const hasLetter = /[a-zA-Z]/.test(new_password);
    const hasNumber = /[0-9]/.test(new_password);
    if (new_password.length < 8 || !hasLetter || !hasNumber) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi minimal 8 karakter dan memuat huruf serta angka.' },
        { status: 400 }
      );
    }

    await initDb();
    const db = getDb();
    const res = await db.execute({
      sql: 'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
      args: [session.id],
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    const currentHash = res.rows[0].password_hash as string;
    const oldMatches = await verifyPassword(old_password, currentHash);
    if (!oldMatches) {
      return NextResponse.json({ success: false, message: 'Kata sandi lama tidak sesuai' }, { status: 400 });
    }

    // Must be different from old password
    const sameAsOld = await verifyPassword(new_password, currentHash);
    if (sameAsOld) {
      return NextResponse.json({ success: false, message: 'Kata sandi baru tidak boleh sama dengan kata sandi lama' }, { status: 400 });
    }

    const newHash = await hashPassword(new_password);
    await db.execute({
      sql: 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [newHash, session.id],
    });

    await logAudit('ubah', 'Kata Sandi', session.id, 'Super admin memperbarui kata sandi');

    return NextResponse.json({ success: true, message: 'Kata sandi berhasil diubah' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui kata sandi' }, { status: 500 });
  }
}
