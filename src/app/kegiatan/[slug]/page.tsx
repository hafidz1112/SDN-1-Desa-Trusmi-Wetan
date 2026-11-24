import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, CheckSquare } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface DetailKegiatanProps {
  params: Promise<{ slug: string }>;
}

async function getDetailKegiatan(slug: string) {
  return await queryOne(
    `
      SELECT a.*, m.file_path as foto_url
      FROM activities a
      LEFT JOIN media m ON a.media_id = m.id
      WHERE a.slug = ? AND a.status = 'terbit'
      LIMIT 1
    `,
    [slug]
  );
}

export default async function DetailKegiatanPage({ params }: DetailKegiatanProps) {
  const { slug } = await params;
  const item = await getDetailKegiatan(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/90 shadow-sm">
          <Link
            href="/kegiatan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8] hover:underline mb-4 sm:mb-6 uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Kegiatan</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            {item.tanggal && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {item.tanggal}
              </span>
            )}
            {item.is_rutin === 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0f3b7a] text-white">
                <CheckSquare className="w-3 h-3 text-amber-400" /> Kegiatan Rutin
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-serif text-[#0f3b7a] leading-tight">
            {item.judul}
          </h1>
        </div>

        {/* Featured Photo */}
        <div className="relative w-full h-56 sm:h-80 md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-slate-100 border border-slate-200">
          <ImageWithFallback
            src={item.foto_url}
            alt={item.judul}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Full Description */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200 shadow-sm">
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line text-left">
            {item.deskripsi || 'Belum ada rincian deskripsi tambahan untuk kegiatan ini.'}
          </div>
        </div>
      </div>
    </div>
  );
}
