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

    let query = 'SELECT * FROM missions';
    if (!isAdmin) {
      query += " WHERE status = 'terbit'";
    }
    query += ' ORDER BY urutan ASC, id ASC';

    const res = await db.execute(query);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Missions GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil misi' }, { status: 500 });
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
    const { poin_misi, urutan, status } = body;

    if (!poin_misi || !poin_misi.trim()) {
      return NextResponse.json({ success: false, message: 'Poin misi wajib diisi' }, { status: 400 });
    }

    const insertRes = await db.execute({
      sql: 'INSERT INTO missions (poin_misi, urutan, status) VALUES (?, ?, ?)',
      args: [poin_misi.trim(), urutan ? Number(urutan) : 0, status || 'terbit'],
    });

    const newId = Number(insertRes.lastInsertRowid);
    await logAudit('tambah', 'Misi', newId, 'Menambah poin misi');

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.', id: newId });
  } catch (error) {
    console.error('Missions POST error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan misi' }, { status: 500 });
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
    const { id, poin_misi, urutan, status } = body;

    if (!id || !poin_misi) {
      return NextResponse.json({ success: false, message: 'ID dan poin misi wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE missions SET
            poin_misi = ?, urutan = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [poin_misi.trim(), urutan ? Number(urutan) : 0, status || 'terbit', id],
    });

    await logAudit('ubah', 'Misi', id, 'Mengubah poin misi');
    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Missions PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah misi' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID misi wajib diisi' }, { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM missions WHERE id = ?', args: [id] });
    await logAudit('hapus', 'Misi', Number(id), `Menghapus poin misi id: ${id}`);

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Missions DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus misi' }, { status: 500 });
  }
}
