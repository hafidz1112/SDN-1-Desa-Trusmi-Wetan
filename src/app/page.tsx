import React from 'react';
import Link from 'next/link';
import {
  Users,
  Trophy,
  ArrowRight,
  BookOpen,
  Sparkles,
  HeartHandshake,
  Monitor,
  ShieldCheck,
  School,
  Library,
} from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import HeroSlider from '@/components/HeroSlider';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const [beranda, heroSlides, identity, profile, spmb, news, achievements, activitiesRutin] =
    await Promise.all([
      queryOne(`
        SELECT s.*,
          m.file_path as hero_media_url,
          m2.file_path as academic_media_url
        FROM site_settings s
        LEFT JOIN media m ON s.hero_media_id = m.id
        LEFT JOIN media m2 ON s.academic_media_id = m2.id
        LIMIT 1
      `),
      query(`
        SELECT s.*, m.file_path as bg_image
        FROM hero_slides s
        LEFT JOIN media m ON s.media_id = m.id
        WHERE s.status = 'terbit'
        ORDER BY s.urutan ASC, s.id ASC
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
        LIMIT 4
      `),
    ]);

  return {
    beranda,
    heroSlides: (heroSlides || []).map((s: any) => ({
      id: Number(s.id),
      badge: s.badge ? String(s.badge) : null,
      title: String(s.title || ''),
      subtitle: s.subtitle ? String(s.subtitle) : null,
      primary_btn_text: s.primary_btn_text ? String(s.primary_btn_text) : 'PENDAFTARAN SPMB',
      primary_btn_href: s.primary_btn_href ? String(s.primary_btn_href) : '/spmb',
      secondary_btn_text: s.secondary_btn_text ? String(s.secondary_btn_text) : 'JELAJAHI PROFIL',
      secondary_btn_href: s.secondary_btn_href ? String(s.secondary_btn_href) : '/profil',
      media_id: s.media_id ? Number(s.media_id) : null,
      bg_image: s.bg_image ? String(s.bg_image) : null,
      urutan: Number(s.urutan || 0),
      status: String(s.status || 'terbit'),
    })),
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
  const heroSlides = data.heroSlides;
  const profile = data.profile;
  const spmb = data.spmb;
  const news = data.news;
  const achievements = data.achievements;
  const activitiesRutin = data.activitiesRutin;

  let academicFeatures = [
    {
      title: 'Kurikulum Merdeka',
      desc: 'Pembelajaran berdiferensiasi dan berbasis proyek (P5) yang berpusat pada minat serta potensi unik peserta didik.',
    },
    {
      title: 'Guru Berpengalaman',
      desc: 'Tenaga pendidik berkompeten dan berdedikasi membimbing perkembangan intelektual serta akhlak murid.',
    },
    {
      title: 'Pembiasaan Religius',
      desc: 'Pelaksanaan rutin salat Duha, tadarus Al-Qur’an, dan penanaman budi pekerti setiap hari di sekolah.',
    },
    {
      title: 'Prestasi Terarah',
      desc: 'Pembinaan intensif olimpiade akademik, kejuaraan olahraga karate & tenis meja, serta seni kreasi siswa.',
    },
  ];

  if (beranda?.academic_features) {
    try {
      const parsed =
        typeof beranda.academic_features === 'string'
          ? JSON.parse(beranda.academic_features)
          : beranda.academic_features;
      if (Array.isArray(parsed) && parsed.length > 0) {
        academicFeatures = parsed;
      }
    } catch {}
  }

  return (
    <div className="pb-16 sm:pb-20 bg-[#fafafa]">
      {/* 1. HERO SLIDER (Fitur Geser / Carousel Berfungsi Interaktif) */}
      <HeroSlider
        heroTitle={beranda?.hero_title}
        heroSubtitle={beranda?.hero_subtitle}
        heroMediaUrl={beranda?.hero_media_url}
        slides={heroSlides}
      />

      {/* 2. FLOATING 4-FEATURE BAR (Primary Blue, 4 Kolom) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:-mt-14 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3.5 px-3 sm:py-5 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-0 lg:divide-x divide-slate-100">
          {/* Feature 1 */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 lg:px-4 p-1 sm:p-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0 border border-blue-100">
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-[#1d4ed8]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate sm:overflow-visible">Ruang Kelas Nyaman</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Fasilitas belajar representatif</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 lg:px-4 p-1 sm:p-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0 border border-blue-100">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#1d4ed8]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate sm:overflow-visible">Guru Berdedikasi</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Pendidik teladan &amp; kompeten</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 lg:px-4 p-1 sm:p-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1d4ed8]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate sm:overflow-visible">Ramah Anak</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Lingkungan aman &amp; asri</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 lg:px-4 p-1 sm:p-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0 border border-blue-100">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#1d4ed8]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate sm:overflow-visible">Pendidikan Holistik</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Religi &amp; karakter budi pekerti</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sisa Konten Beranda */}
      <div className="space-y-12 sm:space-y-20 mt-10 sm:mt-16">
        {/* 3. WELCOME SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: School Image / Students */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-64 sm:h-[400px] rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200/80 bg-slate-100">
              <ImageWithFallback
                src={profile?.foto_kepsek_url}
                alt="SDN 1 Trusmi Wetan"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4 sm:p-5">
                <span className="text-white text-xs font-bold bg-[#0f3b7a] px-3 py-1 rounded shadow">
                  SDN 1 Trusmi Wetan • Cirebon
                </span>
              </div>
            </div>
          </div>

          {/* Right: Welcome Content + 4 Metrics */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-0.5 w-6 bg-amber-500 inline-block" />
                <span className="text-xs font-bold tracking-widest text-[#1d4ed8] uppercase">
                  SELAMAT DATANG DI
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-serif text-slate-900 leading-tight">
                SDN 1 Trusmi Wetan
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
              {profile?.sambutan
                ? profile.sambutan.slice(0, 320) + '...'
                : 'SDN 1 Trusmi Wetan adalah lembaga pendidikan dasar unggulan yang berdedikasi membentuk generasi penerus bangsa yang cerdas, santun, berprestasi, dan berakhlak mulia dengan lingkungan belajar yang inklusif.'}
            </p>

            {/* 4 Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-2.5 sm:py-2 border-y border-slate-200/80">
              <div>
                <span className="block text-lg sm:text-2xl font-black text-[#0f3b7a] font-serif">
                  Akreditasi A
                </span>
                <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  BAN-S/M Kemdikbud
                </span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-black text-[#0f3b7a] font-serif">
                  {beranda?.stat_rombel || 12} Rombel
                </span>
                <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Kelas 1 s.d. 6
                </span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-black text-[#0f3b7a] font-serif">
                  {beranda?.stat_prestasi || 20}+ Juara
                </span>
                <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Tingkat Kab &amp; Kec
                </span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-black text-[#0f3b7a] font-serif">
                  100%
                </span>
                <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Komitmen Karakter
                </span>
              </div>
            </div>

            <div>
              <Link
                href="/profil"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                <span>BACA PROFIL LENGKAP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACADEMICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
            {beranda?.academic_badge || 'AKADEMIK & KEUNGGULAN'}
          </span>
          <h2 className="text-xl sm:text-3xl font-black font-serif text-slate-900 tracking-tight">
            {beranda?.academic_title || 'Belajar, Berkembang, Berprestasi.'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left: 4 Cards in 2x2 Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            {academicFeatures.map((feat, idx) => {
              const icons = [BookOpen, Users, HeartHandshake, Trophy];
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-colors space-y-2.5 sm:space-y-3"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Portrait Image with overlapping dark badge */}
          <div className="lg:col-span-4">
            <div className="relative w-full h-[280px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 bg-slate-100 flex flex-col justify-end">
              <ImageWithFallback
                src={beranda?.academic_media_url || news[0]?.foto_url || null}
                alt="Siswa SDN 1 Trusmi Wetan"
                fill
                className="object-cover"
              />
              <div className="relative z-10 m-3 p-3 sm:m-4 sm:p-4 rounded-xl bg-[#0f3b7a]/95 backdrop-blur-md text-white text-center shadow-lg border border-blue-400/20">
                <span className="block text-xs sm:text-sm font-black uppercase tracking-wider font-serif">
                  {beranda?.academic_card_title || 'Pendidikan Karakter Holistik'}
                </span>
                <span className="block text-[10px] sm:text-[11px] text-amber-300 mt-0.5 font-medium">
                  {beranda?.academic_card_subtitle || 'Religi • Prestasi • Budi Pekerti'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FACILITIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
            FASILITAS SEKOLAH
          </span>
          <h2 className="text-xl sm:text-3xl font-black font-serif text-slate-900 tracking-tight">
            Sarana &amp; Prasarana Pembelajaran
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative">
              <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src="/images/placeholder.svg"
                  alt="Ruang Kelas"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 translate-y-1/2 left-4 z-10 w-9 h-9 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-md border-2 border-white">
                <School className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-5 sm:pt-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900">Ruang Kelas Nyaman</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  12 ruang kelas dilengkapi ventilasi memadai, pencahayaan alami, dan papan representatif.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative">
              <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src="/images/placeholder.svg"
                  alt="Perpustakaan Sekolah"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 translate-y-1/2 left-4 z-10 w-9 h-9 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-md border-2 border-white">
                <Library className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-5 sm:pt-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900">Perpustakaan Sekolah</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Koleksi buku kurikulum, cerita inspiratif, dan bahan bacaan literasi siswa.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative">
              <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src="/images/placeholder.svg"
                  alt="Lapangan Serbaguna"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 translate-y-1/2 left-4 z-10 w-9 h-9 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-md border-2 border-white">
                <Trophy className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-5 sm:pt-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900">Lapangan Serbaguna</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Area upacara bendera, olahraga voli mini, senam Sabtu, dan latihan baris-berbaris.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative">
              <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src="/images/placeholder.svg"
                  alt="Ruang TIK & UKS"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 translate-y-1/2 left-4 z-10 w-9 h-9 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-md border-2 border-white">
                <Monitor className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-5 sm:pt-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900">Fasilitas Penunjang</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ruang Unit Kesehatan Sekolah (UKS) dan perlengkapan literasi digital siswa.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-6 sm:pt-8">
          <Link
            href="/sarana-prasarana"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white font-black text-xs uppercase tracking-wider transition-colors"
          >
            <span>LIHAT SEMUA SARANA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. STUDENT LIFE / ROUTINE ACTIVITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
              PEMBIASAAN &amp; AKTIVITAS SISWA
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-serif text-slate-900 tracking-tight">
              Aktivitas Rutin &amp; Pembentukan Karakter
            </h2>
          </div>
          <Link
            href="/kegiatan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:border-[#1d4ed8] text-[#1d4ed8] font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>LIHAT SEMUA KEGIATAN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {activitiesRutin.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src={act.foto_url}
                  alt={act.judul}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#0f3b7a] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Rutin
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
                    {act.judul}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {act.deskripsi || 'Kegiatan pembiasaan positif siswa di sekolah.'}
                  </p>
                </div>
                <Link
                  href={`/kegiatan/${act.slug}`}
                  className="mt-3 text-[11px] font-bold text-[#1d4ed8] hover:underline flex items-center justify-between"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PRESTASI SISWA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
              ETALASE KEJUARAAN
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-serif text-slate-900 tracking-tight">
              Prestasi &amp; Capaian Juara Siswa
            </h2>
          </div>
          <Link
            href="/prestasi"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:border-[#1d4ed8] text-[#1d4ed8] font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>SEMUA PRESTASI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src={ach.foto_url}
                  alt={ach.nama_prestasi}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow">
                  Tingkat {ach.tingkat || 'Sekolah'}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                    Tahun {ach.tahun || '-'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                    {ach.nama_prestasi}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    Peraih: <span className="font-semibold text-slate-700">{ach.peraih || 'Siswa'}</span>
                  </p>
                </div>
                <Link
                  href={`/prestasi/${ach.id}`}
                  className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-[#1d4ed8] hover:underline flex items-center justify-between"
                >
                  <span>Detail Sertifikat</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION SPMB BANNER (Primary Navy Blue & Amber) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0f3b7a] rounded-2xl p-6 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 border border-blue-800/40">
          <div className="max-w-2xl space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] sm:text-[11px] rounded uppercase tracking-wider">
              <span>STATUS SPMB:</span>
              <span>{spmb?.status_pendaftaran === 'dibuka' ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight">
              Penerimaan Murid Baru (SPMB) Tahun Pelajaran 2026/2027
            </h2>
            <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed">
              Daftarkan putra-putri Anda untuk pendidikan dasar terbaik yang berkarakter, cerdas, dan unggul. Bebas biaya pendaftaran dan didampingi pengajuan bantuan PIP/KIP.
            </p>
          </div>
          <div className="shrink-0 w-full lg:w-auto">
            <Link
              href="/spmb"
              className="w-full lg:w-auto px-6 sm:px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs tracking-wider uppercase rounded-xl shadow-lg transition-transform hover:scale-105 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>INFORMASI &amp; PERSYARATAN</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. WARTA & BERITA TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
              WARTA &amp; PENGUMUMAN
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-serif text-slate-900 tracking-tight">
              Kabar Terkini Sekolah
            </h2>
          </div>
          <Link
            href="/berita"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:border-[#1d4ed8] text-[#1d4ed8] font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>SEMUA BERITA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden">
                <ImageWithFallback
                  src={item.foto_url}
                  alt={item.judul}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <time className="text-[11px] font-bold text-amber-600 block mb-1">
                    {item.tanggal}
                  </time>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                    {item.isi}
                  </p>
                </div>
                <Link
                  href={`/berita/${item.slug}`}
                  className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#1d4ed8] hover:underline flex items-center justify-between"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
