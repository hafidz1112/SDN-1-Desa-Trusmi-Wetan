'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Mail, MapPin, GraduationCap, UserCheck } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [akademikOpen, setAkademikOpen] = useState(false);
  const [akademikDesktopOpen, setAkademikDesktopOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [namaSekolah, setNamaSekolah] = useState('SDN 1 TRUSMI WETAN');
  const akademikRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/settings?type=identity')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data?.identity) {
          if (data.data.identity.logo_url) {
            setLogoUrl(data.data.identity.logo_url);
          }
          if (data.data.identity.nama_sekolah) {
            setNamaSekolah(data.data.identity.nama_sekolah);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!akademikDesktopOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (akademikRef.current && !akademikRef.current.contains(event.target as Node)) {
        setAkademikDesktopOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [akademikDesktopOpen]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Utility Bar: Primary Navy Blue (Selalu 1 Baris Sejajar di Semua Layar) */}
      <div className="bg-[#0f3b7a] text-blue-100 text-[10px] sm:text-[11px] py-1.5 sm:py-2 px-3 sm:px-4 border-b border-blue-950/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          {/* Left contact info: Kepala Sekolah & Email & Location */}
          <div className="flex items-center gap-1.5 sm:gap-6 min-w-0 flex-1">
            <span className="flex items-center gap-1 sm:gap-1.5 text-blue-50 font-medium truncate min-w-0">
              <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Kepala Sekolah: </span>Hj. Marpuah, S.Pd.
              </span>
            </span>
            <a
              href="mailto:sdn1trusmiwetan@gmail.com"
              className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>sdn1trusmiwetan@gmail.com</span>
            </a>
            <span className="hidden lg:flex items-center gap-1.5 text-blue-200/80 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Desa Trusmi Wetan, Plered, Cirebon</span>
            </span>
          </div>

          {/* Right utility links */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <Link
              href="/admin/login"
              className="text-blue-200 hover:text-amber-300 font-medium transition-colors text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              Portal Admin
            </Link>
            <span className="text-blue-400/40">|</span>
            <Link
              href="/spmb"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded text-[9.5px] sm:text-[11px] tracking-wider uppercase transition-colors shadow-xs whitespace-nowrap"
            >
              SPMB 2026/2027
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar: White Background with Primary Blue Typography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-white rounded-xl p-1 shadow-xs border border-slate-100 flex items-center justify-center overflow-hidden">
              <ImageWithFallback
                src={logoUrl || '/images/logo.svg'}
                fallbackSrc="/images/logo.svg"
                alt={`Logo ${namaSekolah}`}
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="block text-base sm:text-xl font-black text-[#0f3b7a] tracking-tight group-hover:text-blue-700 transition-colors font-serif leading-tight truncate sm:overflow-visible">
                {namaSekolah}
              </span>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5 sm:mt-1 truncate">
                Kec. Plered • Kab. Cirebon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 font-bold text-xs uppercase tracking-wider text-slate-700">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/profil"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/profil')
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Profil
            </Link>

            <Link
              href="/identitas"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/identitas')
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Identitas
            </Link>

            {/* Akademik Dropdown */}
            <div className="relative" ref={akademikRef}>
              <button
                type="button"
                onClick={() => setAkademikDesktopOpen((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive('/kelas-guru') || isActive('/ekstrakurikuler') || isActive('/sarana-prasarana')
                    ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                    : 'hover:text-[#1d4ed8] hover:bg-slate-50'
                }`}
                aria-expanded={akademikDesktopOpen}
                aria-haspopup="menu"
              >
                <span>Akademik</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${akademikDesktopOpen ? 'text-[#1d4ed8] rotate-180' : ''}`} />
              </button>
              {akademikDesktopOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 transition-all z-50">
                  <Link
                    href="/kelas-guru"
                    onClick={() => setAkademikDesktopOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1d4ed8]"
                  >
                    Rombel &amp; Tenaga Pendidik
                  </Link>
                  <Link
                    href="/ekstrakurikuler"
                    onClick={() => setAkademikDesktopOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1d4ed8]"
                  >
                    Kegiatan Ekstrakurikuler
                  </Link>
                  <Link
                    href="/sarana-prasarana"
                    onClick={() => setAkademikDesktopOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1d4ed8]"
                  >
                    Sarana &amp; Prasarana
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/kegiatan"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/kegiatan')
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Kegiatan
            </Link>

            <Link
              href="/prestasi"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/prestasi')
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Prestasi
            </Link>

            <Link
              href="/berita"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/berita')
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Berita
            </Link>

            <Link
              href="/galeri"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/galeri')
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Galeri
            </Link>

            <Link
              href="/hubungi-kami"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/hubungi-kami')
                  ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                  : 'hover:text-[#1d4ed8] hover:bg-slate-50'
              }`}
            >
              Kontak
            </Link>

            {/* SPMB Highlight Button */}
            <Link
              href="/spmb"
              className="ml-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-900/20"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>SPMB</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-700 hover:text-[#1d4ed8] hover:bg-slate-100 focus:outline-none"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg max-h-[85vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/') && pathname === '/' ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Beranda
          </Link>

          <Link
            href="/profil"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/profil') ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Profil Sekolah
          </Link>

          <Link
            href="/identitas"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/identitas') ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Identitas &amp; Akreditasi
          </Link>

          <div>
            <button
              onClick={() => setAkademikOpen(!akademikOpen)}
              className="w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <span>Akademik</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${akademikOpen ? 'rotate-180' : ''}`} />
            </button>
            {akademikOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-blue-600 ml-3 my-1">
                <Link
                  href="/kelas-guru"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#1d4ed8]"
                >
                  Rombel &amp; Tenaga Pendidik
                </Link>
                <Link
                  href="/ekstrakurikuler"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#1d4ed8]"
                >
                  Ekstrakurikuler
                </Link>
                <Link
                  href="/sarana-prasarana"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#1d4ed8]"
                >
                  Sarana &amp; Prasarana
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/kegiatan"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/kegiatan') ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Kegiatan Sekolah
          </Link>

          <Link
            href="/prestasi"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/prestasi') ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Prestasi Siswa
          </Link>

          <Link
            href="/berita"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/berita') ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Warta &amp; Berita
          </Link>

          <Link
            href="/galeri"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/galeri') ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Galeri Dokumentasi
          </Link>

          <Link
            href="/hubungi-kami"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/hubungi-kami') ? 'bg-blue-50 text-[#1d4ed8]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Hubungi Kami
          </Link>

          <div className="pt-3">
            <Link
              href="/spmb"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow"
            >
              Informasi SPMB 2026/2027
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
