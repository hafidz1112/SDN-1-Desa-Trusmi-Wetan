import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trophy, ArrowLeft, Award, Calendar, User } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface DetailPrestasiProps {
  params: Promise<{ id: string }>;
}

async function getDetailPrestasi(id: string) {
  return await queryOne(
    `
      SELECT a.*, m.file_path as foto_url
      FROM achievements a
      LEFT JOIN media m ON a.media_id = m.id
      WHERE a.id = ? AND a.status = 'terbit'
      LIMIT 1
    `,
    [id]
  );
}

export default async function DetailPrestasiPage({ params }: DetailPrestasiProps) {
  const { id } = await params;
  const item = await getDetailPrestasi(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <Link
            href="/prestasi"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3b2c] hover:underline mb-6 uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Prestasi</span>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-full uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>Tingkat {item.tingkat || 'Sekolah'}</span>
            </span>
            {item.tahun && (
              <span className="text-xs font-semibold text-slate-500">
                Tahun {item.tahun}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#0b3b2c] leading-tight">
            {item.nama_prestasi}
          </h1>
        </div>

        {/* Featured Photo */}
        <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-md bg-slate-100 border border-slate-200">
          <ImageWithFallback
            src={item.foto_url}
            alt={item.nama_prestasi}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details Card (FR-PUB-030) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Rincian Kejuaraan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Nama Peraih</span>
              <span className="font-bold text-slate-800 text-base mt-1 block">
                {item.peraih || 'Siswa SDN 1 Trusmi Wetan'}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Tingkat Penyelenggaraan</span>
              <span className="font-bold text-slate-800 text-base mt-1 block">
                {item.tingkat || 'Sekolah'}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Tahun Perolehan</span>
              <span className="font-bold text-slate-800 text-base mt-1 block">
                {item.tahun || '-'}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Pemberi Penghargaan</span>
              <span className="font-bold text-slate-800 text-base mt-1 block">
                Dinas Pendidikan / Panitia Lomba
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
