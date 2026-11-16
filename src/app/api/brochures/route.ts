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
      SELECT b.*, m.file_path as file_url, m.original_name, m.mime_type, m.size_bytes
      FROM brochures b
      JOIN media m ON b.media_id = m.id
    `;
    if (!isAdmin) {
      query += " WHERE b.status = 'terbit'";
    }
    query += ' ORDER BY b.tahun DESC, b.id DESC';

    const res = await db.execute(query);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Brochures GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil pamflet' }, { status: 500 });
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
    const { judul, media_id, tahun, status } = body;

    if (!judul || !judul.trim() || !media_id) {
      return NextResponse.json({ success: false, message: 'Judul dan berkas pamflet wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO brochures (judul, media_id, tahun, status)
            VALUES (?, ?, ?, ?)`,
      args: [judul.trim(), Number(media_id), tahun ? Number(tahun) : 2026, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Pamflet SPMB', newId, `Menambah pamflet: ${judul}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Brochures POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan pamflet' }, { status: 500 });
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
    const { id, judul, media_id, tahun, status } = body;

    if (!id || !judul) {
      return NextResponse.json({ success: false, message: 'ID dan judul pamflet wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE brochures SET
            judul = ?, media_id = COALESCE(?, media_id), tahun = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [judul.trim(), media_id ? Number(media_id) : null, tahun ? Number(tahun) : 2026, status || 'terbit', id],
    });

    await logAudit('ubah', 'Pamflet SPMB', id, `Mengubah pamflet: ${judul}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Brochures PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah pamflet' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID pamflet wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM brochures WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Pamflet SPMB', Number(id), `Menghapus pamflet id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Brochures DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus pamflet' }, { status: 500 });
  }
}
