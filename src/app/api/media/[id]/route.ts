import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mediaId = parseInt(id, 10);
    if (isNaN(mediaId)) {
      return new NextResponse('Media ID tidak valid', { status: 400 });
    }

    const db = getDb();

    // Query with timeout race to avoid 10s hang when database network is slow or offline
    const queryPromise = db.execute({
      sql: 'SELECT mime_type, file_path, data_base64 FROM media WHERE id = ? LIMIT 1',
      args: [mediaId],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 3500)
    );

    let res: any;
    try {
      res = await Promise.race([queryPromise, timeoutPromise]);
    } catch {
      // Graceful fallback on connection timeout
      return new NextResponse('Media tidak tersedia saat ini', {
        status: 404,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (!res || !res.rows || res.rows.length === 0) {
      return new NextResponse('Media tidak ditemukan', {
        status: 404,
        headers: { 'Cache-Control': 'public, max-age=60' },
      });
    }

    const media = res.rows[0];
    const mimeType = (media.mime_type as string) || 'image/jpeg';

    // 1. Return from database base64 (cloud / Turso database)
    if (media.data_base64 && typeof media.data_base64 === 'string') {
      const buffer = Buffer.from(media.data_base64, 'base64');
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Fallback to local file if available
    if (media.file_path && typeof media.file_path === 'string' && !media.file_path.startsWith('/api/media/')) {
      try {
        const cleanPath = media.file_path.replace(/^\//, '');
        const diskPath = path.resolve(process.cwd(), 'public', cleanPath);
        const fileBuffer = await fs.readFile(diskPath);
        return new NextResponse(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': fileBuffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } catch {
        // Disk file not found
      }
    }

    return new NextResponse('Konten media tidak ditemukan', {
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return new NextResponse('Media tidak dapat dimuat', { status: 404 });
  }
}
