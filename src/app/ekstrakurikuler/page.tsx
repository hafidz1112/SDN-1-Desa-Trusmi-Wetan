import React from 'react';
import { Sparkles, Calendar, UserCheck } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query } from '@/lib/db';

async function getExtracurricularsData() {
  return await query(`
    SELECT e.*, m.file_path as foto_url
    FROM extracurriculars e
    LEFT JOIN media m ON e.media_id = m.id
    WHERE e.status = 'terbit'
    ORDER BY e.urutan ASC, e.id ASC
  `);
}

export default async function EkstrakurikulerPage() {
  const items = await getExtracurricularsData();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            Pengembangan Bakat &amp; Minat
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kegiatan Ekstrakurikuler
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Wadah bagi siswa SDN 1 Trusmi Wetan mengasah sportivitas, musikalitas, kedisiplinan, dan kecintaan pada seni budaya.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Sparkles className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>Belum ada data ekstrakurikuler.</p>
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
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.nama}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.deskripsi || 'Kegiatan pembinaan minat dan bakat peserta didik.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    {item.pembina && (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>Pembina: <strong className="text-slate-800">{item.pembina}</strong></span>
                      </div>
                    )}
                    {item.jadwal && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>Jadwal: <strong className="text-slate-800">{item.jadwal}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
