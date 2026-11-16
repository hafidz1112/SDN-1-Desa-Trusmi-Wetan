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
      SELECT c.*, s.nama as wali_kelas_nama, s.jabatan as wali_kelas_jabatan
      FROM classes c
      LEFT JOIN staff s ON c.wali_kelas_id = s.id
    `;
    if (!isAdmin) {
      query += " WHERE c.status = 'terbit'";
    }
    query += ' ORDER BY c.urutan ASC, c.id ASC';

    const res = await db.execute(query);

    // Calculate total students (FR-PUB-023)
    let totalSiswa = 0;
    for (const row of res.rows) {
      if (row.jumlah_siswa) {
        totalSiswa += Number(row.jumlah_siswa);
      }
    }

    return NextResponse.json({
      success: true,
      data: res.rows,
      summary: {
        totalClasses: res.rows.length,
        totalSiswa,
      },
    });
  } catch (error) {
    console.error('Classes GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data rombel' }, { status: 500 });
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
    const { nama_rombel, wali_kelas_id, jumlah_siswa, urutan, status } = body;

    if (!nama_rombel || !nama_rombel.trim()) {
      return NextResponse.json({ success: false, message: 'Nama rombel wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO classes (nama_rombel, wali_kelas_id, jumlah_siswa, urutan, status)
            VALUES (?, ?, ?, ?, ?)`,
      args: [nama_rombel.trim(), wali_kelas_id ? Number(wali_kelas_id) : null, jumlah_siswa ? Number(jumlah_siswa) : null, urutan ? Number(urutan) : 0, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Kelas & Rombel', newId, `Menambah rombel: ${nama_rombel}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Classes POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan rombel' }, { status: 500 });
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
    const { id, nama_rombel, wali_kelas_id, jumlah_siswa, urutan, status } = body;

    if (!id || !nama_rombel) {
      return NextResponse.json({ success: false, message: 'ID dan nama rombel wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE classes SET
            nama_rombel = ?, wali_kelas_id = ?, jumlah_siswa = ?, urutan = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [nama_rombel.trim(), wali_kelas_id ? Number(wali_kelas_id) : null, jumlah_siswa ? Number(jumlah_siswa) : null, urutan ? Number(urutan) : 0, status || 'terbit', id],
    });

    await logAudit('ubah', 'Kelas & Rombel', id, `Mengubah rombel: ${nama_rombel}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Classes PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah rombel' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID rombel wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM classes WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Kelas & Rombel', Number(id), `Menghapus rombel id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Classes DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus rombel' }, { status: 500 });
  }
}
