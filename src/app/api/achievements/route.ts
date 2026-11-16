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

    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || (isAdmin ? '10' : '12'), 10);
    const offset = (page - 1) * limit;
    const search = searchParams.get('q');
    const status = searchParams.get('status');

    if (id) {
      let query = `
        SELECT a.*, m.file_path as foto_url
        FROM achievements a
        LEFT JOIN media m ON a.media_id = m.id
        WHERE a.id = ?
      `;
      if (!isAdmin) {
        query += " AND a.status = 'terbit'";
      }
      const res = await db.execute({ sql: query, args: [id] });
      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, message: 'Prestasi tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: res.rows[0] });
    }

    let whereClause = isAdmin ? 'WHERE 1=1' : "WHERE a.status = 'terbit'";
    const queryArgs: any[] = [];

    if (search) {
      whereClause += ' AND (a.nama_prestasi LIKE ? OR a.peraih LIKE ? OR a.tingkat LIKE ?)';
      queryArgs.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (isAdmin && status) {
      whereClause += ' AND a.status = ?';
      queryArgs.push(status);
    }

    const countSql = `SELECT COUNT(*) as total FROM achievements a ${whereClause}`;
    const countRes = await db.execute({ sql: countSql, args: queryArgs });
    const total = Number(countRes.rows[0].total);

    const dataSql = `
      SELECT a.*, m.file_path as foto_url
      FROM achievements a
      LEFT JOIN media m ON a.media_id = m.id
      ${whereClause}
      ORDER BY a.tahun DESC, a.id DESC
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
    console.error('Achievements GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data prestasi' }, { status: 500 });
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
    const { nama_prestasi, peraih, tingkat, tahun, media_id, status } = body;

    if (!nama_prestasi || !nama_prestasi.trim()) {
      return NextResponse.json({ success: false, message: 'Nama prestasi wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO achievements (nama_prestasi, peraih, tingkat, tahun, media_id, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        nama_prestasi.trim(),
        peraih || null,
        tingkat || null,
        tahun ? Number(tahun) : null,
        media_id || null,
        status || 'terbit',
      ],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Prestasi', newId, `Menambah prestasi: ${nama_prestasi}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Achievements POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan prestasi' }, { status: 500 });
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
    const { id, nama_prestasi, peraih, tingkat, tahun, media_id, status } = body;

    if (!id || !nama_prestasi) {
      return NextResponse.json({ success: false, message: 'ID dan nama prestasi wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE achievements SET
            nama_prestasi = ?, peraih = ?, tingkat = ?, tahun = ?, media_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [
        nama_prestasi.trim(),
        peraih || null,
        tingkat || null,
        tahun ? Number(tahun) : null,
        media_id || null,
        status || 'terbit',
        id,
      ],
    });

    await logAudit('ubah', 'Prestasi', id, `Mengubah prestasi: ${nama_prestasi}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Achievements PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah prestasi' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID prestasi wajib diisi' }, { status: 400 });
    }

    const existing = await db.execute({ sql: 'SELECT nama_prestasi FROM achievements WHERE id = ?', args: [id] });
    const nama = existing.rows.length > 0 ? existing.rows[0].nama_prestasi : id;

    await db.execute({ sql: 'DELETE FROM achievements WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Prestasi', Number(id), `Menghapus prestasi: ${nama}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Achievements DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus prestasi' }, { status: 500 });
  }
}
