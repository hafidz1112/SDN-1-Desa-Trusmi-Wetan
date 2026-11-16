import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, Award } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query } from '@/lib/db';

interface PrestasiPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PrestasiPage({ searchParams }: PrestasiPageProps) {
  const resolvedParams = await searchParams;
  const tingkat = typeof resolvedParams.tingkat === 'string' ? resolvedParams.tingkat : '';
  const page = parseInt(typeof resolvedParams.page === 'string' ? resolvedParams.page : '1', 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  let whereClause = "WHERE a.status = 'terbit'";
  const args: any[] = [];

  if (tingkat) {
    whereClause += ' AND a.tingkat = ?';
    args.push(tingkat);
  }

  const countRes = await query(`SELECT COUNT(*) as total FROM achievements a ${whereClause}`, args);
  const total = Number(countRes[0]?.total || 0);
  const totalPages = Math.ceil(total / limit) || 1;

  const dataSql = `
    SELECT a.*, m.file_path as foto_url
    FROM achievements a
    LEFT JOIN media m ON a.media_id = m.id
    ${whereClause}
    ORDER BY a.tahun DESC, a.id DESC
    LIMIT ? OFFSET ?
  `;
  const items = await query(dataSql, [...args, limit, offset]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-0.5 w-6 bg-amber-500 inline-block" />
              <span className="text-xs font-bold tracking-widest text-[#0b3b2c] uppercase">
                ETALASE KEJUARAAN
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0b3b2c] tracking-tight">
              Prestasi Siswa &amp; Sekolah
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
              Daftar pencapaian akademik dan non-akademik peserta didik SDN 1 Trusmi Wetan di berbagai ajang kompetisi.
            </p>
          </div>

          {/* Filter Level */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
            <Link
              href="/prestasi"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                tingkat === ''
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Tingkat
            </Link>
            <Link
              href="/prestasi?tingkat=Kecamatan"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                tingkat === 'Kecamatan'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Kecamatan
            </Link>
            <Link
              href="/prestasi?tingkat=Kabupaten"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                tingkat === 'Kabupaten'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Kabupaten
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Trophy className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>Belum ada data prestasi yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <ImageWithFallback
                    src={item.foto_url}
                    alt={item.nama_prestasi}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-700 shadow-sm">
                    {item.tingkat || 'Sekolah'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Tahun {item.tahun || '-'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {item.nama_prestasi}
                    </h3>
                    {item.peraih && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                        Peraih: <span className="text-slate-700 font-medium">{item.peraih}</span>
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/prestasi/${item.id}`}
                    className="pt-3 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900"
                  >
                    <span>Rincian Piagam</span>
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
                href={`/prestasi?page=${p}${tingkat ? `&tingkat=${tingkat}` : ''}`}
                className={`w-9 h-9 rounded-xl font-semibold text-xs flex items-center justify-center transition-colors ${
                  page === p
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
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
