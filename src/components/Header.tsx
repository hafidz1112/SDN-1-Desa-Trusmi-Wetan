'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Mail, Clock, MapPin } from 'lucide-react';

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
      {/* Top Bar for School Contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Desa Trusmi Wetan, Kec. Plered, Kab. Cirebon
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Senin - Sabtu (07.00 - 12.10 WIB)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">WhatsApp:</span> 0812-3456-7890
            </a>
            <span className="text-slate-600">|</span>
            <Link href="/admin/login" className="hover:text-amber-400 text-slate-400 font-medium transition-colors">
              Masuk Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
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
              <span className="block text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors leading-tight">
                SDN 1 TRUSMI WETAN
              </span>
              <span className="block text-xs font-medium text-slate-500 tracking-wide">
                Kecamatan Plered • Kabupaten Cirebon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 font-medium text-sm text-slate-700">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/profil"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/profil') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Profil
            </Link>

            <Link
              href="/identitas"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/identitas') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Identitas
            </Link>

            {/* Akademik Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/kelas-guru') || isActive('/ekstrakurikuler') || isActive('/sarana-prasarana')
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                Akademik
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 hidden group-hover:block transition-all z-50">
                <Link
                  href="/kelas-guru"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Kelas &amp; Guru
                </Link>
                <Link
                  href="/ekstrakurikuler"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Ekstrakurikuler
                </Link>
                <Link
                  href="/sarana-prasarana"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Sarana &amp; Prasarana
                </Link>
              </div>
            </div>

            <Link
              href="/kegiatan"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/kegiatan') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Kegiatan
            </Link>

            <Link
              href="/prestasi"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/prestasi') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Prestasi
            </Link>

            <Link
              href="/berita"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/berita') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Berita
            </Link>

            <Link
              href="/galeri"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/galeri') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Galeri
            </Link>

            <Link
              href="/hubungi-kami"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/hubungi-kami') ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Hubungi Kami
            </Link>

            {/* SPMB Special Button */}
            <Link
              href="/spmb"
              className={`ml-2 px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
                isActive('/spmb')
                  ? 'bg-amber-500 text-slate-900 shadow-amber-200'
                  : 'bg-blue-700 hover:bg-blue-800 text-white hover:shadow-blue-200'
              }`}
            >
              Informasi SPMB
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/profil"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/profil') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Profil Sekolah
          </Link>
          <Link
            href="/identitas"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/identitas') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Identitas &amp; Akreditasi
          </Link>

          <div>
            <button
              type="button"
              onClick={() => setAkademikOpen(!akademikOpen)}
              className="w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <span>Akademik</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${akademikOpen ? 'rotate-180' : ''}`} />
            </button>
            {akademikOpen && (
              <div className="pl-6 space-y-1 mt-1 border-l-2 border-blue-200 ml-3">
                <Link
                  href="/kelas-guru"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Kelas &amp; Guru
                </Link>
                <Link
                  href="/ekstrakurikuler"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Ekstrakurikuler
                </Link>
                <Link
                  href="/sarana-prasarana"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Sarana &amp; Prasarana
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/kegiatan"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/kegiatan') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Kegiatan
          </Link>
          <Link
            href="/prestasi"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/prestasi') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Prestasi
          </Link>
          <Link
            href="/berita"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/berita') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Berita &amp; Pengumuman
          </Link>
          <Link
            href="/galeri"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/galeri') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Galeri Foto
          </Link>
          <Link
            href="/hubungi-kami"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/hubungi-kami') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Hubungi Kami
          </Link>

          <div className="pt-2">
            <Link
              href="/spmb"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base shadow"
            >
              Informasi SPMB 2027
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
