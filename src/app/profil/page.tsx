import React from 'react';
import { Target, Compass, BookOpen, Clock, Award, ShieldCheck } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getProfileData() {
  const [profile, missions] = await Promise.all([
    queryOne(`
      SELECT p.*,
        m1.file_path as foto_kepsek_url,
        m2.file_path as sejarah_foto_url
      FROM school_profile p
      LEFT JOIN media m1 ON p.foto_kepsek_media_id = m1.id
      LEFT JOIN media m2 ON p.sejarah_media_id = m2.id
      LIMIT 1
    `),
    query("SELECT * FROM missions WHERE status = 'terbit' ORDER BY urutan ASC, id ASC"),
  ]);

  return {
    profile,
    missions,
  };
}

export default async function ProfilPage() {
  const { profile, missions } = await getProfileData();

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-0.5 w-6 bg-amber-500 inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#1d4ed8] uppercase">
              PROFIL LEMBAGA
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0f3b7a] tracking-tight">
            Profil SDN 1 Trusmi Wetan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Mengenal lebih dekat pimpinan sekolah, sejarah berdiri, serta landasan visi, misi, dan tujuan pendidikan kami.
          </p>
        </div>
      </div>

      {/* Sambutan Kepala Sekolah (FR-PUB-018) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-md border-4 border-slate-100 bg-slate-50">
              <ImageWithFallback
                src={profile?.foto_kepsek_url}
                alt={profile?.nama_kepala_sekolah || 'Kepala Sekolah'}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-bold text-slate-900 text-lg">
                {profile?.nama_kepala_sekolah || 'Informasi belum tersedia'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kepala Sekolah SDN 1 Trusmi Wetan
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kata Sambutan Kepala Sekolah</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Menyiapkan Murid Berkarakter di Tengah Dinamika Zaman
            </h2>
            <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
              {profile?.sambutan || 'Informasi belum tersedia.'}
            </div>
          </div>
        </div>
      </section>

      {/* Visi, Misi, dan Tujuan (FR-PUB-019) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Visi */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
              <Compass className="w-4 h-4" />
              <span>Visi Sekolah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              &ldquo;{profile?.visi || 'Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Berprestasi, dan Berwawasan Lingkungan.'}&rdquo;
            </h2>
          </div>

          {/* Misi & Tujuan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Misi */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
                <Target className="w-5 h-5" />
                <h3>Misi Sekolah</h3>
              </div>
              {missions.length === 0 ? (
                <p className="text-sm text-slate-500">Informasi belum tersedia.</p>
              ) : (
                <ol className="space-y-3.5 text-sm text-slate-700">
                  {missions.map((m, idx) => (
                    <li key={m.id} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{m.poin_misi}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Tujuan */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                <BookOpen className="w-5 h-5" />
                <h3>Tujuan Pendidikan</h3>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {profile?.tujuan || 'Informasi belum tersedia.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Singkat (FR-PUB-020) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>Sejarah Singkat</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Perjalanan Panjang Pengabdian bagi Generasi Trusmi Wetan
            </h2>
            <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {profile?.sejarah ||
                'SDN 1 Trusmi Wetan lahir dari penyatuan tiga sekolah dasar untuk menyatukan kekuatan pendidik dan sarana prasarana sekolah di Desa Trusmi Wetan.'}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden shadow-md border-4 border-slate-100 bg-slate-50">
              <ImageWithFallback
                src={profile?.sejarah_foto_url}
                alt="Gedung dan Sejarah SDN 1 Trusmi Wetan"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
