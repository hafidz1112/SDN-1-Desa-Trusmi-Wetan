import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const session = await getSession();
    const isAdmin = !!session;

    const albumId = searchParams.get('album_id');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || (isAdmin ? '12' : '12'), 10);
    const offset = (page - 1) * limit;

    let whereClause = isAdmin ? 'WHERE 1=1' : "WHERE g.status = 'terbit'";
    const queryArgs: any[] = [];

    if (albumId) {
      whereClause += ' AND g.album_id = ?';
      queryArgs.push(albumId);
    }

    const countSql = `SELECT COUNT(*) as total FROM gallery_items g ${whereClause}`;
    const countRes = await db.execute({ sql: countSql, args: queryArgs });
    const total = Number(countRes.rows[0].total);

    const dataSql = `
      SELECT g.*, m.file_path as foto_url, m.original_name, a.nama_album
      FROM gallery_items g
      JOIN media m ON g.media_id = m.id
      LEFT JOIN gallery_albums a ON g.album_id = a.id
      ${whereClause}
      ORDER BY g.id DESC
      LIMIT ? OFFSET ?
    `;
    const dataRes = await db.execute({ sql: dataSql, args: [...queryArgs, limit, offset] });

    return NextResponse.json({
      success: true,
      data: dataRes.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil item galeri' }, { status: 500 });
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
    const { media_id, keterangan, album_id, status } = body;

    // Foto wajib (FR-ADM-033)
    if (!media_id) {
      return NextResponse.json({ success: false, message: 'Foto wajib dipilih untuk galeri' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO gallery_items (media_id, keterangan, album_id, status)
            VALUES (?, ?, ?, ?)`,
      args: [Number(media_id), keterangan || null, album_id ? Number(album_id) : null, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Galeri', newId, 'Menambah foto ke galeri');

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan foto ke galeri' }, { status: 500 });
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
    const { id, keterangan, album_id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID foto galeri wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE gallery_items SET
            keterangan = ?, album_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [keterangan || null, album_id ? Number(album_id) : null, status || 'terbit', id],
    });

    await logAudit('ubah', 'Galeri', id, 'Mengubah informasi foto galeri');
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah galeri' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID galeri wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM gallery_items WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Galeri', Number(id), `Menghapus foto galeri id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus foto galeri' }, { status: 500 });
  }
}
