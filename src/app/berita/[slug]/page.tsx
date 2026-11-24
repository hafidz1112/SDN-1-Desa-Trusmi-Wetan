import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface DetailBeritaProps {
  params: Promise<{ slug: string }>;
}

async function getDetailBerita(slug: string) {
  return await queryOne(
    `
      SELECT n.*, m.file_path as foto_url
      FROM news n
      LEFT JOIN media m ON n.media_id = m.id
      WHERE n.slug = ? AND n.status = 'terbit'
      LIMIT 1
    `,
    [slug]
  );
}

async function getRecentNews(currentSlug: string) {
  return await query(
    `
      SELECT n.judul, n.slug, n.tanggal, m.file_path as foto_url
      FROM news n
      LEFT JOIN media m ON n.media_id = m.id
      WHERE n.slug != ? AND n.status = 'terbit'
      ORDER BY n.tanggal DESC
      LIMIT 3
    `,
    [currentSlug]
  );
}

export default async function DetailBeritaPage({ params }: DetailBeritaProps) {
  const { slug } = await params;
  const item = await getDetailBerita(slug);

  if (!item) {
    notFound();
  }

  const recentItems = await getRecentNews(slug);

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/90 shadow-sm">
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8] hover:underline mb-4 sm:mb-6 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Warta &amp; Publikasi</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            {item.tanggal && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {item.tanggal}
              </span>
            )}
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-bold text-[#1d4ed8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Warta Resmi
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-serif text-[#0f3b7a] leading-tight">
            {item.judul}
          </h1>
        </div>

        {/* Featured Photo */}
        <div className="relative w-full h-56 sm:h-80 md:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-slate-100 border border-slate-200">
          <ImageWithFallback
            src={item.foto_url}
            alt={item.judul}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line text-left">
            {item.isi}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <span>Diterbitkan oleh Humas SDN 1 Trusmi Wetan</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-600">Bagikan:</span>
              <span className="text-slate-400">Salin URL halaman ini untuk berbagi</span>
            </div>
          </div>
        </div>

        {/* Related / Recent News */}
        {recentItems.length > 0 && (
          <div className="pt-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              Berita Terkini Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentItems.map((rec: any) => (
                <Link
                  key={rec.slug}
                  href={`/berita/${rec.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-36 bg-slate-100 w-full">
                    <ImageWithFallback
                      src={rec.foto_url}
                      alt={rec.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {rec.tanggal}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 line-clamp-2 transition-colors">
                      {rec.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
