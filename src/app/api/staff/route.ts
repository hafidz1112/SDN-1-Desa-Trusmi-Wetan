import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    await initDb();
    const db = getDb();
    const session = await getSession();
    const isAdmin = !!session;

    let query = `
      SELECT s.*, m.file_path as foto_url
      FROM staff s
      LEFT JOIN media m ON s.media_id = m.id
    `;
    if (!isAdmin) {
      query += " WHERE s.status = 'terbit'";
    }
    query += ' ORDER BY s.urutan ASC, s.id ASC';

    const res = await db.execute(query);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Staff GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data guru dan staf' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    await initDb();
    const db = getDb();
    const body = await req.json();
    const { nama, jabatan, mata_pelajaran, urutan, media_id, status } = body;

    if (!nama || !nama.trim() || !jabatan || !jabatan.trim()) {
      return NextResponse.json({ success: false, message: 'Nama dan jabatan wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO staff (nama, jabatan, mata_pelajaran, urutan, media_id, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [nama.trim(), jabatan.trim(), mata_pelajaran || null, urutan ? Number(urutan) : 0, media_id || null, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Guru & Tendik', newId, `Menambah staf: ${nama} (${jabatan})`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Staff POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan guru/staf' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    await initDb();
    const db = getDb();
    const body = await req.json();
    const { id, nama, jabatan, mata_pelajaran, urutan, media_id, status } = body;

    if (!id || !nama || !jabatan) {
      return NextResponse.json({ success: false, message: 'ID, nama, dan jabatan wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE staff SET
            nama = ?, jabatan = ?, mata_pelajaran = ?, urutan = ?, media_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [nama.trim(), jabatan.trim(), mata_pelajaran || null, urutan ? Number(urutan) : 0, media_id || null, status || 'terbit', id],
    });

    await logAudit('ubah', 'Guru & Tendik', id, `Mengubah staf: ${nama}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Staff PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah guru/staf' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    await initDb();
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID guru/staf wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'UPDATE classes SET wali_kelas_id = NULL WHERE wali_kelas_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM staff WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Guru & Tendik', Number(id), `Menghapus guru/staf id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Staff DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus guru/staf' }, { status: 500 });
  }
}
