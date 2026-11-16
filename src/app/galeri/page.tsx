import React from 'react';
import { Camera } from 'lucide-react';
import { query } from '@/lib/db';
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
        <div className="max-w-2xl border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            Dokumentasi Visual
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri Kegiatan Sekolah
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
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
