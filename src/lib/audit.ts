import { getDb, initDb } from './db';
import { getSession } from './auth';

export async function logAudit(aksi: 'tambah' | 'ubah' | 'hapus', modul: string, entitas_id?: number, ringkasan?: string) {
  try {
    await initDb();
    const session = await getSession();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO audit_logs (user_id, aksi, modul, entitas_id, ringkasan, waktu)
            VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))`,
      args: [session?.id || null, aksi, modul, entitas_id || null, ringkasan || null],
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
