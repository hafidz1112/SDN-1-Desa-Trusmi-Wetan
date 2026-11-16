import React from 'react';
import Link from 'next/link';
import { CalendarDays, ArrowRight, CheckSquare } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface KegiatanPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KegiatanPage({ searchParams }: KegiatanPageProps) {
  const resolvedParams = await searchParams;
  const rutin = typeof resolvedParams.rutin === 'string' ? resolvedParams.rutin : '';
  const page = parseInt(typeof resolvedParams.page === 'string' ? resolvedParams.page : '1', 10);
  const limit = 9;
  const offset = (page - 1) * limit;

  let whereClause = "WHERE a.status = 'terbit'";
  const args: any[] = [];

  if (rutin === '1') {
    whereClause += ' AND a.is_rutin = 1';
  } else if (rutin === '0') {
    whereClause += ' AND a.is_rutin = 0';
  }

  const countRes = await query(`SELECT COUNT(*) as total FROM activities a ${whereClause}`);
  const total = Number(countRes[0]?.total || 0);
  const totalPages = Math.ceil(total / limit) || 1;

  const dataSql = `
    SELECT a.*, m.file_path as foto_url
    FROM activities a
    LEFT JOIN media m ON a.media_id = m.id
    ${whereClause}
    ORDER BY a.tanggal DESC, a.id DESC
    LIMIT ? OFFSET ?
  `;
  const items = await query(dataSql, [limit, offset]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-0.5 w-6 bg-amber-500 inline-block" />
              <span className="text-xs font-bold tracking-widest text-[#0b3b2c] uppercase">
                DOKUMENTASI &amp; AGENDA
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0b3b2c] tracking-tight">
              Kegiatan Sekolah
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
              Ragam aktivitas pembelajaran, peringatan hari besar, pembiasaan karakter, dan pentas kreasi siswa.
            </p>
          </div>

          {/* Filter Tabs (FR-PUB-027) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
            <Link
              href="/kegiatan"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                rutin === ''
                  ? 'bg-[#0b3b2c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Kegiatan
            </Link>
            <Link
              href="/kegiatan?rutin=1"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                rutin === '1'
                  ? 'bg-[#0b3b2c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kegiatan Rutin
            </Link>
            <Link
              href="/kegiatan?rutin=0"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                rutin === '0'
                  ? 'bg-[#0b3b2c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kegiatan Khusus
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <CalendarDays className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>Belum ada data kegiatan yang diterbitkan.</p>
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
                    alt={item.judul}
                    fill
                    className="object-cover"
                  />
                  {item.is_rutin === 1 && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" />
                      <span>Rutin</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {item.tanggal && (
                      <span className="text-xs font-semibold text-blue-700 block mb-2">
                        {item.tanggal}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {item.deskripsi || 'Dokumentasi kegiatan resmi SDN 1 Trusmi Wetan.'}
                    </p>
                  </div>

                  <Link
                    href={`/kegiatan/${item.slug}`}
                    className="pt-4 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/kegiatan?page=${p}${rutin ? `&rutin=${rutin}` : ''}`}
                className={`w-9 h-9 rounded-xl font-semibold text-xs flex items-center justify-center transition-colors ${
                  page === p
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
