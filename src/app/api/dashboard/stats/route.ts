import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    await initDb();
    const db = getDb();

    const [
      newsTotal,
      newsTerbit,
      newsDraf,
      achTotal,
      achTerbit,
      actTotal,
      actTerbit,
      galleryTotal,
      spmbStatus,
      staffTotal,
      classesTotal,
    ] = await Promise.all([
      db.execute('SELECT COUNT(*) as cnt FROM news'),
      db.execute("SELECT COUNT(*) as cnt FROM news WHERE status = 'terbit'"),
      db.execute("SELECT COUNT(*) as cnt FROM news WHERE status = 'draf'"),
      db.execute('SELECT COUNT(*) as cnt FROM achievements'),
      db.execute("SELECT COUNT(*) as cnt FROM achievements WHERE status = 'terbit'"),
      db.execute('SELECT COUNT(*) as cnt FROM activities'),
      db.execute("SELECT COUNT(*) as cnt FROM activities WHERE status = 'terbit'"),
      db.execute('SELECT COUNT(*) as cnt FROM gallery_items'),
      db.execute('SELECT status_pendaftaran FROM spmb_settings LIMIT 1'),
      db.execute('SELECT COUNT(*) as cnt FROM staff'),
      db.execute('SELECT COUNT(*) as cnt FROM classes'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        news: {
          total: Number(newsTotal.rows[0].cnt),
          terbit: Number(newsTerbit.rows[0].cnt),
          draf: Number(newsDraf.rows[0].cnt),
        },
        achievements: {
          total: Number(achTotal.rows[0].cnt),
          terbit: Number(achTerbit.rows[0].cnt),
        },
        activities: {
          total: Number(actTotal.rows[0].cnt),
          terbit: Number(actTerbit.rows[0].cnt),
        },
        gallery: {
          total: Number(galleryTotal.rows[0].cnt),
        },
        spmb: {
          status: spmbStatus.rows[0]?.status_pendaftaran || 'ditutup',
        },
        staff: {
          total: Number(staffTotal.rows[0].cnt),
        },
        classes: {
          total: Number(classesTotal.rows[0].cnt),
        },
      },
    });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil statistik dashboard' }, { status: 500 });
  }
}
