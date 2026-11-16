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

    let query = 'SELECT * FROM spmb_requirements';
    if (!isAdmin) {
      query += " WHERE status = 'terbit'";
    }
    query += ' ORDER BY urutan ASC, id ASC';

    const res = await db.execute(query);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('SPMB Requirements GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil persyaratan SPMB' }, { status: 500 });
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
    const { nama_dokumen, keterangan, urutan, status } = body;

    if (!nama_dokumen || !nama_dokumen.trim()) {
      return NextResponse.json({ success: false, message: 'Nama dokumen persyaratan wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO spmb_requirements (nama_dokumen, keterangan, urutan, status)
            VALUES (?, ?, ?, ?)`,
      args: [nama_dokumen.trim(), keterangan || null, urutan ? Number(urutan) : 0, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Persyaratan SPMB', newId, `Menambah syarat: ${nama_dokumen}`);

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('SPMB Requirements POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan persyaratan SPMB' }, { status: 500 });
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
    const { id, nama_dokumen, keterangan, urutan, status } = body;

    if (!id || !nama_dokumen) {
      return NextResponse.json({ success: false, message: 'ID dan nama dokumen wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE spmb_requirements SET
            nama_dokumen = ?, keterangan = ?, urutan = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [nama_dokumen.trim(), keterangan || null, urutan ? Number(urutan) : 0, status || 'terbit', id],
    });

    await logAudit('ubah', 'Persyaratan SPMB', id, `Mengubah syarat: ${nama_dokumen}`);
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('SPMB Requirements PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah persyaratan SPMB' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID persyaratan wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM spmb_requirements WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Persyaratan SPMB', Number(id), `Menghapus persyaratan id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('SPMB Requirements DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus persyaratan SPMB' }, { status: 500 });
  }
}
