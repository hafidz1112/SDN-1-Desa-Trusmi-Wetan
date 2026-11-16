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
    const status = searchParams.get('status');

    if (slug || id) {
      let query = `
        SELECT n.*, m.file_path as foto_url
        FROM news n
        LEFT JOIN media m ON n.media_id = m.id
        WHERE ${slug ? 'n.slug = ?' : 'n.id = ?'}
      `;
      const args = [slug || id];
      if (!isAdmin) {
        query += " AND n.status = 'terbit'";
      }

      const res = await db.execute({ sql: query, args });
      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, message: 'Berita tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: res.rows[0] });
    }

    let whereClause = isAdmin ? 'WHERE 1=1' : "WHERE n.status = 'terbit'";
    const queryArgs: any[] = [];

    if (search) {
      whereClause += ' AND (n.judul LIKE ? OR n.isi LIKE ?)';
      queryArgs.push(`%${search}%`, `%${search}%`);
    }

    if (isAdmin && status) {
      whereClause += ' AND n.status = ?';
      queryArgs.push(status);
    }

    const countSql = `SELECT COUNT(*) as total FROM news n ${whereClause}`;
    const countRes = await db.execute({ sql: countSql, args: queryArgs });
    const total = Number(countRes.rows[0].total);

    const dataSql = `
      SELECT n.*, m.file_path as foto_url
      FROM news n
      LEFT JOIN media m ON n.media_id = m.id
      ${whereClause}
      ORDER BY n.tanggal DESC, n.id DESC
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
    console.error('News GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil berita' }, { status: 500 });
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
    const { judul, isi, tanggal, media_id, status } = body;

    if (!judul || !judul.trim() || !isi || !isi.trim()) {
      return NextResponse.json({ success: false, message: 'Judul dan isi berita wajib diisi' }, { status: 400 });
    }

    let baseSlug = slugify(judul);
    let finalSlug = baseSlug;
    let counter = 1;

    // Check slug uniqueness (FR-ADM-026)
    while (true) {
      const check = await db.execute({ sql: 'SELECT id FROM news WHERE slug = ?', args: [finalSlug] });
      if (check.rows.length === 0) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tgl = tanggal || new Date().toISOString().split('T')[0];
    const stat = status === 'draf' ? 'draf' : 'terbit';

    const insertRes = await db.execute({
      sql: `INSERT INTO news (judul, slug, isi, tanggal, media_id, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [judul.trim(), finalSlug, isi.trim(), tgl, media_id || null, stat],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Berita', newId, `Menambah berita: ${judul}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('News POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan berita' }, { status: 500 });
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
    const { id, judul, isi, tanggal, media_id, status } = body;

    if (!id || !judul || !isi) {
      return NextResponse.json({ success: false, message: 'ID, judul, dan isi wajib diisi' }, { status: 400 });
    }

    const existing = await db.execute({ sql: 'SELECT id, judul, slug FROM news WHERE id = ?', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    let slug = existing.rows[0].slug as string;
    if (judul.trim() !== (existing.rows[0].judul as string)) {
      let baseSlug = slugify(judul);
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await db.execute({ sql: 'SELECT id FROM news WHERE slug = ? AND id != ?', args: [slug, id] });
        if (check.rows.length === 0) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    await db.execute({
      sql: `UPDATE news SET
            judul = ?, slug = ?, isi = ?, tanggal = ?, media_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [judul.trim(), slug, isi.trim(), tanggal, media_id || null, status || 'terbit', id],
    });

    await logAudit('ubah', 'Berita', id, `Mengubah berita: ${judul}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('News PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah berita' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID berita wajib diisi' }, { status: 400 });
    }

    const existing = await db.execute({ sql: 'SELECT judul FROM news WHERE id = ?', args: [id] });
    const judul = existing.rows.length > 0 ? existing.rows[0].judul : id;

    await db.execute({ sql: 'DELETE FROM news WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Berita', Number(id), `Menghapus berita: ${judul}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('News DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus berita' }, { status: 500 });
  }
}
