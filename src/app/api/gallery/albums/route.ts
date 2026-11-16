import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    await initDb();
    const db = getDb();
    const res = await db.execute(`
      SELECT a.*, COUNT(g.id) as item_count
      FROM gallery_albums a
      LEFT JOIN gallery_items g ON a.id = g.album_id
      GROUP BY a.id
      ORDER BY a.nama_album ASC
    `);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Gallery Albums GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil album galeri' }, { status: 500 });
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
    const { nama_album } = body;

    if (!nama_album || !nama_album.trim()) {
      return NextResponse.json({ success: false, message: 'Nama album wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: 'INSERT INTO gallery_albums (nama_album) VALUES (?)',
      args: [nama_album.trim()],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Galeri Album', newId, `Menambah album: ${nama_album}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Gallery Album POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan album' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID album wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'UPDATE gallery_items SET album_id = NULL WHERE album_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM gallery_albums WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Galeri Album', Number(id), `Menghapus album id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Gallery Album DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus album' }, { status: 500 });
  }
}
