import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { validateUsername, validatePassword, containsSqlInjection } from '@/lib/security';

const VALID_ROLES = ['super_admin', 'admin'] as const;

function isSuperAdmin(session: { role?: string } | null) {
  return !!session && session.role === 'super_admin';
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }
    if (session.role !== 'super_admin') {
      return NextResponse.json({ success: false, message: 'Hanya super admin yang dapat melihat pengguna' }, { status: 403 });
    }

    await initDb();
    const db = getDb();
    const res = await db.execute(
      'SELECT id, username, nama, role, last_login_at, created_at, updated_at FROM users ORDER BY id ASC'
    );

    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data pengguna' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ success: false, message: 'Hanya super admin yang dapat menambah pengguna' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Format data tidak valid' }, { status: 400 });
    }

    const { username, nama, password, role } = body as {
      username?: string;
      nama?: string;
      password?: string;
      role?: string;
    };

    if (!username || !nama || !password) {
      return NextResponse.json({ success: false, message: 'Username, nama, dan kata sandi wajib diisi' }, { status: 400 });
    }

    const usernameValidation = validateUsername(username as string);
    if (!usernameValidation.isValid || !usernameValidation.cleanUsername) {
      return NextResponse.json({ success: false, message: usernameValidation.error || 'Username tidak valid' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password as string);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ success: false, message: passwordValidation.error || 'Kata sandi tidak valid' }, { status: 400 });
    }

    const cleanNama = String(nama as string).trim();
    if (cleanNama.length < 2 || cleanNama.length > 100) {
      return NextResponse.json({ success: false, message: 'Nama harus antara 2 hingga 100 karakter' }, { status: 400 });
    }
    if (containsSqlInjection(cleanNama)) {
      return NextResponse.json({ success: false, message: 'Pola tidak sah terdeteksi pada nama' }, { status: 400 });
    }

    const chosenRole = VALID_ROLES.includes(role as any) ? (role as 'super_admin' | 'admin') : 'admin';

    await initDb();
    const db = getDb();

    const exists = await db.execute({
      sql: 'SELECT id FROM users WHERE username = ? LIMIT 1',
      args: [usernameValidation.cleanUsername],
    });
    if (exists.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'Username sudah digunakan' }, { status: 409 });
    }

    const hash = await hashPassword(password as string);
    const insertRes = await db.execute({
      sql: 'INSERT INTO users (username, nama, password_hash, role) VALUES (?, ?, ?, ?)',
      args: [usernameValidation.cleanUsername, cleanNama, hash, chosenRole],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Manajemen User', newId, `Menambah pengguna: ${usernameValidation.cleanUsername} (${chosenRole})`);

    return NextResponse.json({ success: true, message: 'Pengguna berhasil ditambahkan.', id: newId });
  } catch (error) {
    console.error('Users POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan pengguna' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ success: false, message: 'Hanya super admin yang dapat mengubah pengguna' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Format data tidak valid' }, { status: 400 });
    }

    const { id, username, nama, password, role } = body as {
      id?: number | string;
      username?: string;
      nama?: string;
      password?: string;
      role?: string;
    };
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID pengguna wajib diisi' }, { status: 400 });
    }

    await initDb();
    const db = getDb();

    const targetRes = await db.execute({
      sql: 'SELECT id, username, role FROM users WHERE id = ? LIMIT 1',
      args: [Number(id)],
    });
    if (targetRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }
    const target = targetRes.rows[0];

    const cleanNama = nama ? String(nama).trim() : null;
    if (cleanNama && (cleanNama.length < 2 || cleanNama.length > 100)) {
      return NextResponse.json({ success: false, message: 'Nama harus antara 2 hingga 100 karakter' }, { status: 400 });
    }
    if (cleanNama && containsSqlInjection(cleanNama)) {
      return NextResponse.json({ success: false, message: 'Pola tidak sah terdeteksi pada nama' }, { status: 400 });
    }

    let cleanUsername: string | null = null;
    if (username) {
      const usernameValidation = validateUsername(username as string);
      if (!usernameValidation.isValid || !usernameValidation.cleanUsername) {
        return NextResponse.json({ success: false, message: usernameValidation.error || 'Username tidak valid' }, { status: 400 });
      }
      cleanUsername = usernameValidation.cleanUsername;

      const dup = await db.execute({
        sql: 'SELECT id FROM users WHERE username = ? AND id <> ? LIMIT 1',
        args: [cleanUsername, Number(id)],
      });
      if (dup.rows.length > 0) {
        return NextResponse.json({ success: false, message: 'Username sudah digunakan' }, { status: 409 });
      }
    }

    const chosenRole = role && VALID_ROLES.includes(role as any) ? (role as 'super_admin' | 'admin') : (target.role as 'super_admin' | 'admin');

    // Prevent removing last super admin
    if (target.role === 'super_admin' && chosenRole !== 'super_admin') {
      const countRes = await db.execute("SELECT COUNT(*) as cnt FROM users WHERE role = 'super_admin'");
      if (Number(countRes.rows[0].cnt) <= 1) {
        return NextResponse.json({ success: false, message: 'Tidak dapat menurunkan peran super admin terakhir' }, { status: 400 });
      }
    }

    const updates: string[] = [];
    const args: Array<string | number | null> = [];

    if (cleanUsername) {
      updates.push('username = ?');
      args.push(cleanUsername);
    }
    if (cleanNama) {
      updates.push('nama = ?');
      args.push(cleanNama);
    }
    if (chosenRole && chosenRole !== target.role) {
      updates.push('role = ?');
      args.push(chosenRole);
    }

    if (password) {
      const passwordValidation = validatePassword(password as string);
      if (!passwordValidation.isValid) {
        return NextResponse.json({ success: false, message: passwordValidation.error || 'Kata sandi tidak valid' }, { status: 400 });
      }
      const hash = await hashPassword(password as string);
      updates.push('password_hash = ?');
      args.push(hash);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, message: 'Tidak ada perubahan.' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push(id);
    await db.execute({
      sql: `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    await logAudit('ubah', 'Manajemen User', Number(id), `Mengubah pengguna id: ${id}`);

    return NextResponse.json({ success: true, message: 'Pengguna berhasil diperbarui.' });
  } catch (error) {
    console.error('Users PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui pengguna' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ success: false, message: 'Hanya super admin yang dapat menghapus pengguna' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID pengguna wajib diisi' }, { status: 400 });
    }
    const numericId = Number(id);
    if (numericId === session.id) {
      return NextResponse.json({ success: false, message: 'Tidak dapat menghapus akun sendiri' }, { status: 400 });
    }

    await initDb();
    const db = getDb();

    const targetRes = await db.execute({
      sql: 'SELECT id, role FROM users WHERE id = ? LIMIT 1',
      args: [numericId],
    });
    if (targetRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }
    const target = targetRes.rows[0];

    if (target.role === 'super_admin') {
      const countRes = await db.execute("SELECT COUNT(*) as cnt FROM users WHERE role = 'super_admin'");
      if (Number(countRes.rows[0].cnt) <= 1) {
        return NextResponse.json({ success: false, message: 'Tidak dapat menghapus super admin terakhir' }, { status: 400 });
      }
    }

    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [numericId] });
    await logAudit('hapus', 'Manajemen User', numericId, `Menghapus pengguna id: ${numericId}`);

    return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error('Users DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}