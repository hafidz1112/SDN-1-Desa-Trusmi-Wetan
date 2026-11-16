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

    let query = 'SELECT * FROM spmb_schedules';
    if (!isAdmin) {
      query += " WHERE status = 'terbit'";
    }
    query += ' ORDER BY tanggal_mulai ASC, id ASC';

    const res = await db.execute(query);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('SPMB Schedules GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil jadwal SPMB' }, { status: 500 });
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
    const { tahap, tanggal_mulai, tanggal_selesai, keterangan, status } = body;

    if (!tahap || !tanggal_mulai) {
      return NextResponse.json({ success: false, message: 'Tahap dan tanggal mulai wajib diisi' }, { status: 400 });
    }

    if (tahap !== 'pendaftaran' && tahap !== 'daftar_ulang') {
      return NextResponse.json({ success: false, message: 'Tahap hanya boleh "pendaftaran" atau "daftar_ulang"' }, { status: 400 });
    }

    // Validation: tanggal_selesai must not be before tanggal_mulai (FR-ADM-025, MSG-11)
    if (tanggal_selesai && tanggal_selesai < tanggal_mulai) {
      return NextResponse.json({ success: false, message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO spmb_schedules (tahap, tanggal_mulai, tanggal_selesai, keterangan, status)
            VALUES (?, ?, ?, ?, ?)`,
      args: [tahap, tanggal_mulai, tanggal_selesai || null, keterangan || null, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Jadwal SPMB', newId, `Menambah jadwal: ${tahap} (${tanggal_mulai})`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('SPMB Schedules POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan jadwal SPMB' }, { status: 500 });
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
    const { id, tahap, tanggal_mulai, tanggal_selesai, keterangan, status } = body;

    if (!id || !tahap || !tanggal_mulai) {
      return NextResponse.json({ success: false, message: 'ID, tahap, dan tanggal mulai wajib diisi' }, { status: 400 });
    }

    if (tahap !== 'pendaftaran' && tahap !== 'daftar_ulang') {
      return NextResponse.json({ success: false, message: 'Tahap hanya boleh "pendaftaran" atau "daftar_ulang"' }, { status: 400 });
    }

    if (tanggal_selesai && tanggal_selesai < tanggal_mulai) {
      return NextResponse.json({ success: false, message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE spmb_schedules SET
            tahap = ?, tanggal_mulai = ?, tanggal_selesai = ?, keterangan = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [tahap, tanggal_mulai, tanggal_selesai || null, keterangan || null, status || 'terbit', id],
    });

    await logAudit('ubah', 'Jadwal SPMB', id, `Mengubah jadwal: ${tahap}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('SPMB Schedules PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah jadwal SPMB' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID jadwal wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM spmb_schedules WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Jadwal SPMB', Number(id), `Menghapus jadwal id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('SPMB Schedules DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus jadwal SPMB' }, { status: 500 });
  }
}
