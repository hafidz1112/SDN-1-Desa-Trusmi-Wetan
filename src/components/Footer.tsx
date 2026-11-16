import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ExternalLink, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#07241a] text-emerald-100/90 pt-16 pb-8 border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Identity & Social */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl p-1 border border-emerald-500/30 flex items-center justify-center">
                <Image
                  src="/images/logo.svg"
                  alt="Logo SDN 1 Trusmi Wetan"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="block text-lg font-black text-white font-serif tracking-tight leading-none">
                  SDN 1 TRUSMI WETAN
                </span>
                <span className="block text-xs font-semibold text-amber-400 mt-1 uppercase tracking-wider">
                  NPSN: 20215000 • Akreditasi A
                </span>
              </div>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Membentuk generasi peserta didik yang berakhlak mulia, cerdas, berprestasi, dan berwawasan lingkungan di pusat sentra budaya batik Trusmi Cirebon.
            </p>
            <div className="flex items-center space-x-2.5 pt-2">
              <a
                href="https://instagram.com/sdn1trusmiwetan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-950 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center text-emerald-200 transition-colors border border-emerald-800/50"
                aria-label="Instagram SDN 1 Trusmi Wetan"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@sdn1trusmiwetan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-950 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center text-emerald-200 transition-colors border border-emerald-800/50"
                aria-label="TikTok SDN 1 Trusmi Wetan"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.65c.02 2.01-.61 4.09-1.89 5.65-1.57 1.95-4.04 3.06-6.52 2.92-2.47-.1-4.78-1.39-6.17-3.41-1.39-2.01-1.66-4.66-.75-6.88.92-2.22 2.93-3.79 5.3-4.14.73-.11 1.48-.11 2.21 0v4.18c-.46-.14-.95-.19-1.43-.16-1.07.07-2.07.72-2.55 1.68-.48.96-.37 2.15.28 3 .65.85 1.74 1.29 2.81 1.11 1.07-.18 1.94-1.05 2.12-2.12.06-.39.06-.79.06-1.18V.02h.02z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-950 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-emerald-200 transition-colors border border-emerald-800/50"
                aria-label="WhatsApp SDN 1 Trusmi Wetan"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-emerald-800/60 inline-block text-amber-400">
              Tautan Cepat
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/profil" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Profil &amp; Sambutan Kepala Sekolah</span>
                </Link>
              </li>
              <li>
                <Link href="/identitas" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Identitas &amp; Akreditasi Sekolah</span>
                </Link>
              </li>
              <li>
                <Link href="/kelas-guru" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Rombel &amp; Tenaga Pendidik</span>
                </Link>
              </li>
              <li>
                <Link href="/sarana-prasarana" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Fasilitas &amp; Sarana Prasarana</span>
                </Link>
              </li>
              <li>
                <Link href="/ekstrakurikuler" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Kegiatan Ekstrakurikuler</span>
                </Link>
              </li>
              <li>
                <Link href="/spmb" className="hover:text-amber-300 text-amber-400 font-bold transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  <span>Portal SPMB 2026/2027</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Academics */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-emerald-800/60 inline-block text-amber-400">
              Informasi Publik
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/berita" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Warta &amp; Berita Terkini</span>
                </Link>
              </li>
              <li>
                <Link href="/kegiatan" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Agenda Kegiatan Sekolah</span>
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Etalase Prestasi Siswa</span>
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Galeri &amp; Dokumentasi Visual</span>
                </Link>
              </li>
              <li>
                <Link href="/spmb" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Program Bantuan PIP / KIP</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-emerald-800/60 inline-block text-amber-400">
              Kantor Sekolah
            </h3>
            <ul className="space-y-3 text-xs text-emerald-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Desa Trusmi Wetan, Kec. Plered, Kab. Cirebon, Jawa Barat 45154</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(0231) 321890 / 0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>sdn1trusmiwetan@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Senin - Sabtu: 07.00 - 12.10 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-emerald-900/40 text-xs text-emerald-300/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            &copy; 2026 SDN 1 Trusmi Wetan. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center space-x-4 text-[11px]">
            <Link href="/hubungi-kami" className="hover:text-amber-300 transition-colors">
              Peta Lokasi
            </Link>
            <span>•</span>
            <Link href="/spmb" className="hover:text-amber-300 transition-colors">
              Persyaratan SPMB
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-amber-300 transition-colors font-medium">
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
