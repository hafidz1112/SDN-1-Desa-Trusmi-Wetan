'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Mail, MapPin, GraduationCap, UserCheck } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [akademikOpen, setAkademikOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Utility Bar: Primary Navy Blue */}
      <div className="bg-[#0f3b7a] text-blue-100 text-[11px] py-2 px-4 border-b border-blue-950/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left contact info: Kepala Sekolah & Email & Location */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-blue-50 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Kepala Sekolah: Hj. Marpuah, S.Pd.</span>
            </span>
            <a
              href="mailto:sdn1trusmiwetan@gmail.com"
              className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>sdn1trusmiwetan@gmail.com</span>
            </a>
            <span className="hidden lg:flex items-center gap-1.5 text-blue-200/80">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Desa Trusmi Wetan, Plered, Cirebon</span>
            </span>
          </div>

          {/* Right utility links */}
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/login"
              className="text-blue-200 hover:text-amber-300 font-medium transition-colors text-[11px]"
            >
              Portal Admin
            </Link>
            <span className="text-blue-400/40">|</span>
            <Link
              href="/spmb"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1 rounded-md text-[11px] tracking-wider uppercase transition-colors shadow-xs"
            >
              SPMB 2026/2027
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar: White Background with Primary Blue Typography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/logo.svg"
                alt="Logo SDN 1 Trusmi Wetan"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="block text-xl font-black text-[#0f3b7a] tracking-tight group-hover:text-blue-700 transition-colors font-serif leading-none">
                SDN 1 TRUSMI WETAN
              </span>
              <span className="block text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-1">
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
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive('/kelas-guru') || isActive('/ekstrakurikuler') || isActive('/sarana-prasarana')
                    ? 'text-[#1d4ed8] bg-blue-50/90 font-black border-b-2 border-[#1d4ed8]'
                    : 'hover:text-[#1d4ed8] hover:bg-slate-50'
                }`}
              >
                <span>Akademik</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1d4ed8] transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block transition-all z-50">
                <Link
                  href="/kelas-guru"
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1d4ed8]"
                >
                  Rombel &amp; Tenaga Pendidik
                </Link>
                <Link
                  href="/ekstrakurikuler"
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1d4ed8]"
                >
                  Kegiatan Ekstrakurikuler
                </Link>
                <Link
                  href="/sarana-prasarana"
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1d4ed8]"
                >
                  Sarana &amp; Prasarana
                </Link>
              </div>
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
