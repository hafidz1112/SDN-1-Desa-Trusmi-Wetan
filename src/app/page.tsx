import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trophy,
  Calendar,
  ArrowRight,
  GraduationCap,
  Users,
  Layers,
  Award,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
} from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query, queryOne } from '@/lib/db';

async function getHomeData() {
  const [beranda, identity, profile, spmb, news, achievements, activitiesRutin] =
    await Promise.all([
      queryOne(`
        SELECT s.*, m.file_path as hero_media_url
        FROM site_settings s
        LEFT JOIN media m ON s.hero_media_id = m.id
        LIMIT 1
      `),
      queryOne('SELECT * FROM school_identity LIMIT 1'),
      queryOne(`
        SELECT p.*, m.file_path as foto_kepsek_url
        FROM school_profile p
        LEFT JOIN media m ON p.foto_kepsek_media_id = m.id
        LIMIT 1
      `),
      queryOne('SELECT * FROM spmb_settings LIMIT 1'),
      query(`
        SELECT n.*, m.file_path as foto_url
        FROM news n
        LEFT JOIN media m ON n.media_id = m.id
        WHERE n.status = 'terbit'
        ORDER BY n.tanggal DESC, n.id DESC
        LIMIT 3
      `),
      query(`
        SELECT a.*, m.file_path as foto_url
        FROM achievements a
        LEFT JOIN media m ON a.media_id = m.id
        WHERE a.status = 'terbit'
        ORDER BY a.tahun DESC, a.id DESC
        LIMIT 4
      `),
      query(`
        SELECT act.*, m.file_path as foto_url
        FROM activities act
        LEFT JOIN media m ON act.media_id = m.id
        WHERE act.status = 'terbit' AND act.is_rutin = 1
        ORDER BY act.id ASC
        LIMIT 6
      `),
    ]);

  return {
    beranda,
    identity,
    profile,
    spmb,
    news,
    achievements,
    activitiesRutin,
  };
}

export default async function HomePage() {
  const data = await getHomeData();
  const beranda = data.beranda;
  const profile = data.profile;
  const spmb = data.spmb;
  const news = data.news;
  const achievements = data.achievements;
  const activitiesRutin = data.activitiesRutin;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Banner (FR-PUB-012) */}
      <section className="relative bg-slate-900 text-white min-h-[520px] sm:min-h-[580px] flex items-center overflow-hidden">
        {beranda?.hero_media_url ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={beranda.hero_media_url}
              alt="Gedung SDN 1 Trusmi Wetan"
              fill
              className="object-cover opacity-25"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 opacity-90 z-0" />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sekolah Ramah Anak Berbasis Budaya Trusmi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {beranda?.hero_title || 'Membentuk Generasi Berkarakter, Cerdas, dan Berbudaya'}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {beranda?.hero_subtitle ||
                'Selamat Datang di Website Resmi SDN 1 Trusmi Wetan, wadah pembelajaran inklusif yang melahirkan generasi cerdas dan berprestasi.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/spmb"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Informasi SPMB 2027</span>
              </Link>
              <Link
                href="/profil"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Profil Sekolah</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ringkasan Statistik (FR-PUB-014) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex items-center gap-4 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">
                {beranda?.stat_siswa || 312}
              </span>
              <span className="block text-xs font-medium text-slate-500">Murid Aktif</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">
                {beranda?.stat_guru || 16}
              </span>
              <span className="block text-xs font-medium text-slate-500">Guru &amp; Tenaga Pendidik</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">
                {beranda?.stat_rombel || 12}
              </span>
              <span className="block text-xs font-medium text-slate-500">Rombongan Belajar</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">
                {beranda?.stat_prestasi || 20}+
              </span>
              <span className="block text-xs font-medium text-slate-500">Prestasi Juara</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah Singkat (FR-PUB-013) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
              <ImageWithFallback
                src={profile?.foto_kepsek_url}
                alt={profile?.nama_kepala_sekolah || 'Kepala Sekolah SDN 1 Trusmi Wetan'}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Sambutan Pimpinan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Membangun Kualitas Pendidikan Dasar yang Berakar pada Budaya dan Karakter
            </h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-4">
              {profile?.sambutan ||
                'Selamat datang di website resmi SDN 1 Trusmi Wetan. Kehadiran portal ini merupakan komitmen sekolah dalam mewujudkan keterbukaan informasi publik dan mempererat hubungan dengan masyarakat luas.'}
            </div>
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block font-bold text-slate-900 text-base">
                  {profile?.nama_kepala_sekolah || 'Hj. Marpuah, S.Pd.'}
                </span>
                <span className="block text-xs text-slate-500">
                  Kepala Sekolah SDN 1 Trusmi Wetan
                </span>
              </div>
              <Link
                href="/profil"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                <span>Baca Sambutan Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sorotan Prestasi (FR-PUB-015 - Max 4 Prestasi) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Bangga Berprestasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Sorotan Prestasi Sekolah
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Membuktikan dedikasi belajar dan keuletan peserta didik dalam berbagai kejuaraan.
            </p>
          </div>
          <Link
            href="/prestasi"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <span>Lihat Semua Prestasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src={ach.foto_url}
                  alt={ach.nama_prestasi}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-700 shadow-sm">
                  {ach.tingkat || 'Sekolah'}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Tahun {ach.tahun || '-'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {ach.nama_prestasi}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                    Peraih: <span className="text-slate-700 font-medium">{ach.peraih || 'Siswa Berbakat'}</span>
                  </p>
                </div>
                <Link
                  href={`/prestasi/${ach.id}`}
                  className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center justify-between"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kegiatan Rutin Sekolah (FR-PUB-017) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Pembiasaan Positif
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kegiatan Rutin Pembentuk Karakter
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Pembiasaan ibadah, kebugaran fisik, kedisiplinan, dan bimbingan akademik yang dilaksanakan terjadwal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activitiesRutin.map((act) => (
              <div
                key={act.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-slate-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {act.judul}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {act.deskripsi || 'Kegiatan rutin dalam rangka penanaman karakter profil pelajar pancasila.'}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Rutin Mingguan</span>
                  <Link
                    href={`/kegiatan/${act.slug}`}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <span>Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita & Pengumuman Terbaru (FR-PUB-016 - Max 3 Berita) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Informasi Terkini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Kabar &amp; Pengumuman Sekolah
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Warta resmi agenda akademik, edaran orang tua, dan liputan kegiatan SDN 1 Trusmi Wetan.
            </p>
          </div>
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src={item.foto_url}
                  alt={item.judul}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <time className="text-xs font-semibold text-blue-700 block mb-2">
                    {item.tanggal}
                  </time>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-3">
                    {item.isi}
                  </p>
                </div>
                <Link
                  href={`/berita/${item.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SPMB Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-bold text-xs rounded-full">
              <span>Status SPMB 2027:</span>
              <span className="uppercase">{spmb?.status_pendaftaran === 'dibuka' ? 'Dibuka' : 'Ditutup'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Penerimaan Murid Baru (SPMB) SDN 1 Trusmi Wetan
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Persiapkan berkas pendaftaran calon murid sejak dini. Sekolah kami melayani pendaftaran fisik secara transparan dan mendampingi pencairan beasiswa PIP/KIP bagi keluarga prasejahtera.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/spmb"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-2xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Lihat Persyaratan &amp; Jadwal</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
