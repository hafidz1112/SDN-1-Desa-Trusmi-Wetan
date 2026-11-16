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
      SELECT e.*, m.file_path as foto_url
      FROM extracurriculars e
      LEFT JOIN media m ON e.media_id = m.id
    `;
    if (!isAdmin) {
      query += " WHERE e.status = 'terbit'";
    }
    query += ' ORDER BY e.urutan ASC, e.id ASC';

    const res = await db.execute(query);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Extracurriculars GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data ekstrakurikuler' }, { status: 500 });
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
    const { nama, deskripsi, pembina, jadwal, urutan, media_id, status } = body;

    if (!nama || !nama.trim()) {
      return NextResponse.json({ success: false, message: 'Nama ekstrakurikuler wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO extracurriculars (nama, deskripsi, pembina, jadwal, urutan, media_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [nama.trim(), deskripsi || null, pembina || null, jadwal || null, urutan ? Number(urutan) : 0, media_id || null, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Ekstrakurikuler', newId, `Menambah ekskul: ${nama}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Extracurriculars POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan ekstrakurikuler' }, { status: 500 });
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
    const { id, nama, deskripsi, pembina, jadwal, urutan, media_id, status } = body;

    if (!id || !nama) {
      return NextResponse.json({ success: false, message: 'ID dan nama ekstrakurikuler wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE extracurriculars SET
            nama = ?, deskripsi = ?, pembina = ?, jadwal = ?, urutan = ?, media_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [nama.trim(), deskripsi || null, pembina || null, jadwal || null, urutan ? Number(urutan) : 0, media_id || null, status || 'terbit', id],
    });

    await logAudit('ubah', 'Ekstrakurikuler', id, `Mengubah ekskul: ${nama}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Extracurriculars PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah ekstrakurikuler' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID ekstrakurikuler wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM extracurriculars WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Ekstrakurikuler', Number(id), `Menghapus ekstrakurikuler id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Extracurriculars DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus ekstrakurikuler' }, { status: 500 });
  }
}
