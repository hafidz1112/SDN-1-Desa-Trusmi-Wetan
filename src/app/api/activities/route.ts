import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { slugify } from '@/lib/slug';

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const session = await getSession();
    const isAdmin = !!session;

    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || (isAdmin ? '10' : '9'), 10);
    const offset = (page - 1) * limit;
    const search = searchParams.get('q');
    const rutin = searchParams.get('rutin');
    const status = searchParams.get('status');

    if (slug || id) {
      let query = `
        SELECT a.*, m.file_path as foto_url
        FROM activities a
        LEFT JOIN media m ON a.media_id = m.id
        WHERE ${slug ? 'a.slug = ?' : 'a.id = ?'}
      `;
      const args = [slug || id];
      if (!isAdmin) {
        query += " AND a.status = 'terbit'";
      }
      const res = await db.execute({ sql: query, args });
      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, message: 'Kegiatan tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: res.rows[0] });
    }

    let whereClause = isAdmin ? 'WHERE 1=1' : "WHERE a.status = 'terbit'";
    const queryArgs: any[] = [];

    if (rutin === '1') {
      whereClause += ' AND a.is_rutin = 1';
    } else if (rutin === '0') {
      whereClause += ' AND a.is_rutin = 0';
    }

    if (search) {
      whereClause += ' AND (a.judul LIKE ? OR a.deskripsi LIKE ?)';
      queryArgs.push(`%${search}%`, `%${search}%`);
    }

    if (isAdmin && status) {
      whereClause += ' AND a.status = ?';
      queryArgs.push(status);
    }

    const countSql = `SELECT COUNT(*) as total FROM activities a ${whereClause}`;
    const countRes = await db.execute({ sql: countSql, args: queryArgs });
    const total = Number(countRes.rows[0].total);

    const dataSql = `
      SELECT a.*, m.file_path as foto_url
      FROM activities a
      LEFT JOIN media m ON a.media_id = m.id
      ${whereClause}
      ORDER BY a.tanggal DESC, a.id DESC
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
    console.error('Activities GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil kegiatan' }, { status: 500 });
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
    const { judul, deskripsi, tanggal, is_rutin, media_id, status } = body;

    if (!judul || !judul.trim()) {
      return NextResponse.json({ success: false, message: 'Judul kegiatan wajib diisi' }, { status: 400 });
    }

    let baseSlug = slugify(judul);
    let finalSlug = baseSlug;
    let counter = 1;

    while (true) {
      const check = await db.execute({ sql: 'SELECT id FROM activities WHERE slug = ?', args: [finalSlug] });
      if (check.rows.length === 0) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tgl = tanggal || new Date().toISOString().split('T')[0];
    const rutin = is_rutin ? 1 : 0;
    const stat = status || 'terbit';

    const insertRes = await db.execute({
      sql: `INSERT INTO activities (judul, slug, deskripsi, tanggal, is_rutin, media_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [judul.trim(), finalSlug, deskripsi || null, tgl, rutin, media_id || null, stat],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Kegiatan', newId, `Menambah kegiatan: ${judul}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Activities POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan kegiatan' }, { status: 500 });
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
    const { id, judul, deskripsi, tanggal, is_rutin, media_id, status } = body;

    if (!id || !judul) {
      return NextResponse.json({ success: false, message: 'ID dan judul kegiatan wajib diisi' }, { status: 400 });
    }

    const existing = await db.execute({ sql: 'SELECT id, judul, slug FROM activities WHERE id = ?', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Kegiatan tidak ditemukan' }, { status: 404 });
    }

    let slug = existing.rows[0].slug as string;
    if (judul.trim() !== (existing.rows[0].judul as string)) {
      let baseSlug = slugify(judul);
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await db.execute({ sql: 'SELECT id FROM activities WHERE slug = ? AND id != ?', args: [slug, id] });
        if (check.rows.length === 0) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    await db.execute({
      sql: `UPDATE activities SET
            judul = ?, slug = ?, deskripsi = ?, tanggal = ?, is_rutin = ?, media_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [judul.trim(), slug, deskripsi || null, tanggal || null, is_rutin ? 1 : 0, media_id || null, status || 'terbit', id],
    });

    await logAudit('ubah', 'Kegiatan', id, `Mengubah kegiatan: ${judul}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Activities PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah kegiatan' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID kegiatan wajib diisi' }, { status: 400 });
    }

    const existing = await db.execute({ sql: 'SELECT judul FROM activities WHERE id = ?', args: [id] });
    const judul = existing.rows.length > 0 ? existing.rows[0].judul : id;

    await db.execute({ sql: 'DELETE FROM activities WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Kegiatan', Number(id), `Menghapus kegiatan: ${judul}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Activities DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus kegiatan' }, { status: 500 });
  }
}
