'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Mail, Clock, MapPin, GraduationCap } from 'lucide-react';

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
      {/* Top Bar matching reference: Dark Forest Green */}
      <div className="bg-[#0b3b2c] text-emerald-100 text-[11px] py-2 px-4 border-b border-emerald-950/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left contact info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>(0231) 321890 / 0812-3456-7890</span>
            </a>
            <a
              href="mailto:sdn1trusmiwetan@gmail.com"
              className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>sdn1trusmiwetan@gmail.com</span>
            </a>
            <span className="hidden lg:flex items-center gap-1.5 text-emerald-200/80">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Desa Trusmi Wetan, Plered, Cirebon</span>
            </span>
          </div>

          {/* Right utility links */}
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/login"
              className="text-emerald-200 hover:text-amber-300 font-medium transition-colors text-[11px]"
            >
              Portal Admin
            </Link>
            <span className="text-emerald-800">|</span>
            <Link
              href="/spmb"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1 rounded text-[11px] tracking-wider uppercase transition-colors shadow-xs"
            >
              SPMB 2026/2027
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar: White Background with Elegant Typography */}
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
              <span className="block text-xl font-black text-[#0b3b2c] tracking-tight group-hover:text-emerald-800 transition-colors font-serif leading-none">
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
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/profil"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/profil')
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
              }`}
            >
              Profil
            </Link>

            <Link
              href="/identitas"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/identitas')
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
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
                    ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                    : 'hover:text-[#0b3b2c] hover:bg-slate-50'
                }`}
              >
                <span>Akademik</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b3b2c] transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block transition-all z-50">
                <Link
                  href="/kelas-guru"
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0b3b2c]"
                >
                  Rombel &amp; Tenaga Pendidik
                </Link>
                <Link
                  href="/ekstrakurikuler"
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0b3b2c]"
                >
                  Kegiatan Ekstrakurikuler
                </Link>
                <Link
                  href="/sarana-prasarana"
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0b3b2c]"
                >
                  Sarana &amp; Prasarana
                </Link>
              </div>
            </div>

            <Link
              href="/kegiatan"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/kegiatan')
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
              }`}
            >
              Kegiatan
            </Link>

            <Link
              href="/prestasi"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/prestasi')
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
              }`}
            >
              Prestasi
            </Link>

            <Link
              href="/berita"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/berita')
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
              }`}
            >
              Berita
            </Link>

            <Link
              href="/galeri"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/galeri')
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
              }`}
            >
              Galeri
            </Link>

            <Link
              href="/hubungi-kami"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/hubungi-kami')
                  ? 'text-[#0b3b2c] bg-emerald-50/80 font-black border-b-2 border-[#0b3b2c]'
                  : 'hover:text-[#0b3b2c] hover:bg-slate-50'
              }`}
            >
              Kontak
            </Link>

            {/* SPMB Highlight Button */}
            <Link
              href="/spmb"
              className="ml-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0b3b2c] hover:bg-[#07291f] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-950/20"
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
              className="p-2 rounded-lg text-slate-700 hover:text-[#0b3b2c] hover:bg-slate-100 focus:outline-none"
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
              isActive('/') && pathname === '/' ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Beranda
          </Link>

          <Link
            href="/profil"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/profil') ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Profil Sekolah
          </Link>

          <Link
            href="/identitas"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/identitas') ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
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
              <div className="pl-4 space-y-1 border-l-2 border-emerald-600 ml-3 my-1">
                <Link
                  href="/kelas-guru"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0b3b2c]"
                >
                  Rombel &amp; Tenaga Pendidik
                </Link>
                <Link
                  href="/ekstrakurikuler"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0b3b2c]"
                >
                  Ekstrakurikuler
                </Link>
                <Link
                  href="/sarana-prasarana"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0b3b2c]"
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
              isActive('/kegiatan') ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Kegiatan Sekolah
          </Link>

          <Link
            href="/prestasi"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/prestasi') ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Prestasi Siswa
          </Link>

          <Link
            href="/berita"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/berita') ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Warta &amp; Berita
          </Link>

          <Link
            href="/galeri"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/galeri') ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Galeri Dokumentasi
          </Link>

          <Link
            href="/hubungi-kami"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-bold ${
              isActive('/hubungi-kami') ? 'bg-emerald-50 text-[#0b3b2c]' : 'text-slate-700 hover:bg-slate-50'
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
