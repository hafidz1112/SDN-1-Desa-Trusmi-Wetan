'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Award, GraduationCap } from 'lucide-react';

interface HeroSliderProps {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroMediaUrl?: string | null;
}

export default function HeroSlider({
  heroTitle,
  heroSubtitle,
  heroMediaUrl,
}: HeroSliderProps) {
  const slides = [
    {
      id: 1,
      badge: 'Sekolah Dasar Negeri Unggulan & Berkarakter',
      badgeIcon: Sparkles,
      title: heroTitle || 'Membentuk Generasi Cerdas, Berkarakter & Berprestasi',
      subtitle:
        heroSubtitle ||
        'Di SDN 1 Trusmi Wetan, kami membina generasi muda yang berakhlak mulia, cerdas, berprestasi, dan berwawasan lingkungan melalui kurikulum yang menginspirasi.',
      primaryBtn: { text: 'PENDAFTARAN SPMB', href: '/spmb' },
      secondaryBtn: { text: 'JELAJAHI PROFIL', href: '/profil' },
      bgImage: heroMediaUrl,
    },
    {
      id: 2,
      badge: 'Penerimaan Peserta Didik Baru (SPMB 2026/2027)',
      badgeIcon: GraduationCap,
      title: 'Pintu Gerbang Menuju Masa Depan Anak Gemilang',
      subtitle:
        'Pendidikan dasar holistik dengan bimbingan pendidik tersertifikasi serta sarana prasarana ramah anak yang siap mendampingi tumbuh kembang anak didik.',
      primaryBtn: { text: 'INFORMASI SPMB', href: '/spmb' },
      secondaryBtn: { text: 'LIHAT FASILITAS', href: '/sarana-prasarana' },
      bgImage: heroMediaUrl,
    },
    {
      id: 3,
      badge: 'Terakreditasi A • Kemendikbudristek RI',
      badgeIcon: Award,
      title: 'Mengukir Prestasi, Menumbuhkan Budi Pekerti',
      subtitle:
        'Aktif mencetak insan unggul di bidang akademik, keagamaan, dan seni kreasi dengan lingkungan belajar yang asri, aman, dan kondusif.',
      primaryBtn: { text: 'LIHAT PRESTASI', href: '/prestasi' },
      secondaryBtn: { text: 'HUBUNGI KAMI', href: '/hubungi-kami' },
      bgImage: heroMediaUrl,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const current = slides[currentIndex];
  const BadgeIcon = current.badgeIcon;

  return (
    <section
      aria-label="Hero Carousel"
      className="relative bg-[#071933] text-white min-h-[540px] sm:min-h-[620px] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image / Gradient per slide */}
      <div className="absolute inset-0 z-0">
        {current.bgImage ? (
          <Image
            src={current.bgImage}
            alt="Kampus SDN 1 Trusmi Wetan"
            fill
            className="object-cover opacity-30 transition-opacity duration-700 ease-in-out"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#071933] via-[#0d2f5e] to-[#051429] opacity-95" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071933]/95 via-[#0c2a54]/80 to-transparent" />
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="max-w-2xl space-y-6 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-amber-300 text-[11px] font-bold tracking-widest uppercase shadow-sm">
            <BadgeIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{current.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight leading-[1.14]">
            {current.title}
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl font-normal">
            {current.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={current.primaryBtn.href}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/25 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{current.primaryBtn.text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={current.secondaryBtn.href}
              className="px-6 py-3.5 rounded-xl border-2 border-white/80 hover:bg-white/10 text-white font-black text-xs tracking-wider uppercase transition-all inline-flex items-center gap-2"
            >
              <span>{current.secondaryBtn.text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Previous Arrow */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full border border-white/30 bg-slate-900/40 text-white hover:bg-white/20 transition-all z-20 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Interactive Next Arrow */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Slide selanjutnya"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full border border-white/30 bg-slate-900/40 text-white hover:bg-white/20 transition-all z-20 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Interactive Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2.5 z-20">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(idx)}
            aria-label={`Buka slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
              currentIndex === idx
                ? 'w-8 h-2 bg-amber-400 shadow-sm'
                : 'w-2.5 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
