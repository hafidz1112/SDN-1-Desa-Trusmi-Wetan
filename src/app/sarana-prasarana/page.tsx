import React from 'react';
import { School, CheckCircle2 } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getFacilitiesData() {
  return await query(`
    SELECT f.*, m.file_path as foto_url
    FROM facilities f
    LEFT JOIN media m ON f.media_id = m.id
    WHERE f.status = 'terbit'
    ORDER BY f.id ASC
  `);
}

export default async function SaranaPrasaranaPage() {
  const items = await getFacilitiesData();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-0.5 w-6 bg-amber-500 inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#1d4ed8] uppercase">
              FASILITAS PEMBELAJARAN
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0f3b7a] tracking-tight">
            Sarana &amp; Prasarana Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Kelengkapan fasilitas fisik dan ruang penunjang proses belajar mengajar yang aman, bersih, dan memadai di SDN 1 Trusmi Wetan.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <School className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>Belum ada data fasilitas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <ImageWithFallback
                    src={item.foto_url}
                    alt={item.nama}
                    fill
                    className="object-cover"
                  />
                  {item.jumlah && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-900 shadow-sm">
                      {item.jumlah} Unit / Ruang
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.nama}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.deskripsi || 'Fasilitas penunjang pembelajaran berkualitas bagi peserta didik.'}
                    </p>
                  </div>

                  {item.kondisi && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Kondisi Fasilitas:</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.kondisi}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
