import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    await initDb();
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const modul = searchParams.get('modul');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query = `
      SELECT a.*, u.username as admin_username, u.nama as admin_nama
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
    `;
    const args: any[] = [];

    if (modul) {
      query += ' WHERE a.modul = ?';
      args.push(modul);
    }

    query += ' ORDER BY a.id DESC LIMIT ?';
    args.push(limit);

    const res = await db.execute({ sql: query, args });
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    console.error('Audit logs GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil catatan aktivitas' }, { status: 500 });
  }
}
