'use client';

import React, { useState } from 'react';
import { Camera, X, ZoomIn, Filter } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface GalleryItem {
  id: number;
  keterangan: string | null;
  album_id: number | null;
  foto_url: string | null;
  nama_album: string | null;
  created_at?: string;
}

interface Album {
  id: number;
  nama_album: string;
}

interface GalleryGridProps {
  albums: Album[];
  items: GalleryItem[];
}

export default function GalleryGrid({ albums, items }: GalleryGridProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<number | 'all'>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filteredItems = selectedAlbum === 'all'
    ? items
    : items.filter((item) => item.album_id === selectedAlbum);

  return (
    <div className="space-y-8">
      {/* Album Filters */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Filter Album:
        </span>
        <button
          onClick={() => setSelectedAlbum('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedAlbum === 'all'
              ? 'bg-[#1d4ed8] text-white shadow-sm shadow-blue-950/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Semua Foto ({items.length})
        </button>
        {albums.map((album) => {
          const count = items.filter((it) => it.album_id === album.id).length;
          return (
            <button
              key={album.id}
              onClick={() => setSelectedAlbum(album.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedAlbum === album.id
                  ? 'bg-[#1d4ed8] text-white shadow-sm shadow-blue-950/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {album.nama_album} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400">
          <Camera className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-slate-600">Belum ada foto dalam album ini</p>
          <p className="text-xs text-slate-400 mt-1">Foto dokumentasi kegiatan akan diunggah secara berkala.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src={item.foto_url}
                  alt={item.keterangan || 'Foto Kegiatan SDN 1 Trusmi Wetan'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-md">
                    <ZoomIn className="w-5 h-5" />
                  </span>
                </div>
                {item.nama_album && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-blue-900 shadow-xs">
                    {item.nama_album}
                  </span>
                )}
              </div>

              {item.keterangan && (
                <div className="p-3.5 flex-1">
                  <p className="text-xs font-medium text-slate-700 line-clamp-2">
                    {item.keterangan}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo container */}
            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-slate-950">
              <ImageWithFallback
                src={activePhoto.foto_url}
                alt={activePhoto.keterangan || 'Foto kegiatan'}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Details caption */}
            <div className="p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {activePhoto.nama_album && (
                  <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mb-1">
                    {activePhoto.nama_album}
                  </span>
                )}
                <p className="text-sm font-semibold text-slate-900">
                  {activePhoto.keterangan || 'Dokumentasi SDN 1 Trusmi Wetan'}
                </p>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="self-end sm:self-auto px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
