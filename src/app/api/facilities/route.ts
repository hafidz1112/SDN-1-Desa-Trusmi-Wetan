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
      SELECT f.*, m.file_path as foto_url
      FROM facilities f
      LEFT JOIN media m ON f.media_id = m.id
    `;
    if (!isAdmin) {
      query += " WHERE f.status = 'terbit'";
    }
    query += ' ORDER BY f.id ASC';

    const res = await db.execute(query);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Facilities GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data fasilitas' }, { status: 500 });
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
    const { nama, deskripsi, jumlah, kondisi, media_id, status } = body;

    if (!nama || !nama.trim()) {
      return NextResponse.json({ success: false, message: 'Nama fasilitas wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO facilities (nama, deskripsi, jumlah, kondisi, media_id, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [nama.trim(), deskripsi || null, jumlah ? Number(jumlah) : null, kondisi || null, media_id || null, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Fasilitas', newId, `Menambah fasilitas: ${nama}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Facilities POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan fasilitas' }, { status: 500 });
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
    const { id, nama, deskripsi, jumlah, kondisi, media_id, status } = body;

    if (!id || !nama) {
      return NextResponse.json({ success: false, message: 'ID dan nama fasilitas wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE facilities SET
            nama = ?, deskripsi = ?, jumlah = ?, kondisi = ?, media_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [nama.trim(), deskripsi || null, jumlah ? Number(jumlah) : null, kondisi || null, media_id || null, status || 'terbit', id],
    });

    await logAudit('ubah', 'Fasilitas', id, `Mengubah fasilitas: ${nama}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Facilities PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah fasilitas' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID fasilitas wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM facilities WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Fasilitas', Number(id), `Menghapus fasilitas id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Facilities DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus fasilitas' }, { status: 500 });
  }
}
