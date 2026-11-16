import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, FileText } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query } from '@/lib/db';

interface BeritaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(typeof resolvedParams.page === 'string' ? resolvedParams.page : '1', 10);
  const limit = 9;
  const offset = (page - 1) * limit;

  const countRes = await query("SELECT COUNT(*) as total FROM news WHERE status = 'terbit'");
  const total = Number(countRes[0]?.total || 0);
  const totalPages = Math.ceil(total / limit) || 1;

  const dataSql = `
    SELECT n.*, m.file_path as foto_url
    FROM news n
    LEFT JOIN media m ON n.media_id = m.id
    WHERE n.status = 'terbit'
    ORDER BY n.tanggal DESC, n.id DESC
    LIMIT ? OFFSET ?
  `;
  const items = await query(dataSql, [limit, offset]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-0.5 w-6 bg-amber-500 inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#0b3b2c] uppercase">
              WARTA &amp; PUBLIKASI
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0b3b2c] tracking-tight">
            Berita &amp; Pengumuman Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Informasi terkini mengenai agenda sekolah, edaran resmi orang tua murid, prestasi, dan kalender akademik.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>Belum ada berita yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              // Quote max 150 characters (FR-PUB-031)
              const rawIsi = (item.isi as string) || '';
              const snippet = rawIsi.length > 150 ? `${rawIsi.substring(0, 150)}...` : rawIsi;

              return (
                <article
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
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <time className="text-xs font-semibold text-blue-700 block mb-2">
                        {item.tanggal}
                      </time>
                      <h2 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2">
                        {item.judul}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">
                        {snippet}
                      </p>
                    </div>

                    <Link
                      href={`/berita/${item.slug}`}
                      className="pt-4 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900"
                    >
                      <span>Baca Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/berita?page=${p}`}
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
