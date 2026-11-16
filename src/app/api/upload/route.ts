import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, initDb } from '@/lib/db';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const isDoc = formData.get('is_doc') === 'true';

    if (!file) {
      return NextResponse.json({ success: false, message: 'Berkas tidak ditemukan' }, { status: 400 });
    }

    const mime = file.type.toLowerCase();
    const size = file.size;
    const originalName = file.name;

    // Allowed mime types & size checks
    if (isDoc) {
      const allowedDocMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedDocMimes.includes(mime)) {
        return NextResponse.json({ success: false, message: 'Format dokumen tidak didukung. Gunakan PDF, JPG, atau PNG.' }, { status: 400 });
      }
      if (size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, message: 'Ukuran dokumen melebihi batas 10 MB.' }, { status: 400 });
      }
    } else {
      const allowedImgMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedImgMimes.includes(mime)) {
        return NextResponse.json({ success: false, message: 'Format berkas tidak didukung. Gunakan JPG, PNG, atau WEBP.' }, { status: 400 });
      }
      if (size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, message: 'Ukuran foto melebihi batas 5 MB.' }, { status: 400 });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const randomHex = crypto.randomBytes(16).toString('hex');
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    let finalFilePath = '';
    let finalSize = size;
    let finalWidth: number | null = null;
    let finalHeight: number | null = null;
    let finalMime = mime;

    if (!isDoc && mime.startsWith('image/')) {
      // Process with sharp (resize max 1600px dimension, webp 80% quality)
      const filename = `${randomHex}.webp`;
      const fullPath = path.join(uploadsDir, filename);

      const processed = await sharp(buffer)
        .rotate() // Auto-orient from EXIF
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      await fs.writeFile(fullPath, processed);
      const metadata = await sharp(processed).metadata();

      finalFilePath = `/uploads/${filename}`;
      finalSize = processed.length;
      finalWidth = metadata.width || null;
      finalHeight = metadata.height || null;
      finalMime = 'image/webp';
    } else {
      // For PDF or direct docs
      const ext = path.extname(originalName) || (mime === 'application/pdf' ? '.pdf' : '.bin');
      const filename = `${randomHex}${ext}`;
      const fullPath = path.join(uploadsDir, filename);
      await fs.writeFile(fullPath, buffer);
      finalFilePath = `/uploads/${filename}`;
    }

    await initDb();
    const db = getDb();
    const insertRes = await db.execute({
      sql: `INSERT INTO media (file_path, original_name, mime_type, size_bytes, width, height)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [finalFilePath, originalName, finalMime, finalSize, finalWidth, finalHeight],
    });

    const mediaId = Number(insertRes.lastInsertRowid);

    return NextResponse.json({
      success: true,
      data: {
        id: mediaId,
        file_path: finalFilePath,
        original_name: originalName,
        mime_type: finalMime,
        size_bytes: finalSize,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memproses unggahan berkas' }, { status: 500 });
  }
}
