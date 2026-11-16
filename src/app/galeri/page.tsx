import React from 'react';
import { Camera } from 'lucide-react';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
import GalleryGrid from '@/components/GalleryGrid';

async function getGalleryData() {
  const [albums, items] = await Promise.all([
    query('SELECT * FROM gallery_albums ORDER BY nama_album ASC'),
    query(`
      SELECT g.*, m.file_path as foto_url, a.nama_album
      FROM gallery_items g
      LEFT JOIN media m ON g.media_id = m.id
      LEFT JOIN gallery_albums a ON g.album_id = a.id
      WHERE g.status = 'terbit'
      ORDER BY g.id DESC
    `),
  ]);

  return {
    albums,
    items,
  };
}

export default async function GaleriPage() {
  const { albums, items } = await getGalleryData();

  return (
    <div className="py-12 sm:py-16 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-0.5 w-6 bg-amber-500 inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#0b3b2c] uppercase">
              DOKUMENTASI VISUAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0b3b2c] tracking-tight">
            Galeri Kegiatan Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Momen-momen berharga dalam kegiatan belajar mengajar, upacara, perlombaan, dan ragam kreativitas siswa SDN 1 Trusmi Wetan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryGrid albums={albums} items={items} />
      </div>
    </div>
  );
}
