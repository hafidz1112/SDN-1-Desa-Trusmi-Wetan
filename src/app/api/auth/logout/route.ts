import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST() {
  await logAudit('ubah', 'Auth', undefined, 'Super admin keluar dari dashboard');
  await destroySession();
  return NextResponse.json({ success: true, message: 'Berhasil keluar' });
}
