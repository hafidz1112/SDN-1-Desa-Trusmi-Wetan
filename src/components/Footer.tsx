import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo.svg"
                alt="Logo SDN 1 Trusmi Wetan"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <span className="block text-base font-bold text-white leading-tight">
                  SDN 1 TRUSMI WETAN
                </span>
                <span className="block text-xs text-slate-400">
                  NPSN: 20215000 • Akreditasi: A
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mewujudkan peserta didik yang berakhlak mulia, cerdas, berprestasi, dan berwawasan lingkungan di pusat kearifan budaya Trusmi, Cirebon.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com/sdn1trusmiwetan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram SDN 1 Trusmi Wetan"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@sdn1trusmiwetan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
                aria-label="TikTok SDN 1 Trusmi Wetan"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.65c.02 2.01-.61 4.09-1.89 5.65-1.57 1.95-4.04 3.06-6.52 2.92-2.47-.1-4.78-1.39-6.17-3.41-1.39-2.01-1.66-4.66-.75-6.88.92-2.22 2.93-3.79 5.3-4.14.73-.11 1.48-.11 2.21 0v4.18c-.46-.14-.95-.19-1.43-.16-1.07.07-2.07.72-2.55 1.68-.48.96-.37 2.15.28 3 .65.85 1.74 1.29 2.81 1.11 1.07-.18 1.94-1.05 2.12-2.12.06-.39.06-.79.06-1.18V.02h.02z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp SDN 1 Trusmi Wetan"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Tautan Utama
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/profil" className="hover:text-amber-400 transition-colors">
                  Profil &amp; Sambutan Kepala Sekolah
                </Link>
              </li>
              <li>
                <Link href="/identitas" className="hover:text-amber-400 transition-colors">
                  Identitas &amp; Akreditasi Sekolah
                </Link>
              </li>
              <li>
                <Link href="/kelas-guru" className="hover:text-amber-400 transition-colors">
                  Data Rombel &amp; Dewan Guru
                </Link>
              </li>
              <li>
                <Link href="/ekstrakurikuler" className="hover:text-amber-400 transition-colors">
                  Kegiatan Ekstrakurikuler
                </Link>
              </li>
              <li>
                <Link href="/sarana-prasarana" className="hover:text-amber-400 transition-colors">
                  Fasilitas &amp; Sarana Prasarana
                </Link>
              </li>
              <li>
                <Link href="/spmb" className="text-amber-400 font-medium hover:underline">
                  Informasi SPMB 2027 &amp; PIP/KIP
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Kontak Sekolah
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Desa Trusmi Wetan, Kec. Plered, Kabupaten Cirebon, Jawa Barat 45154</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>(0231) 321890 / 0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>sdn1trusmiwetan@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Jam Operasional
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>Senin - Kamis</span>
                <span className="text-slate-200 font-medium">07.00 - 12.10 WIB</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>Jumat</span>
                <span className="text-slate-200 font-medium">07.00 - 11.00 WIB</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>Sabtu</span>
                <span className="text-slate-200 font-medium">07.00 - 11.30 WIB</span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1">
                <span>Minggu</span>
                <span className="text-red-400 font-medium">Libur</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            &copy; 2026 SDN 1 Trusmi Wetan. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/hubungi-kami" className="hover:text-slate-400">
              Peta Lokasi
            </Link>
            <span>•</span>
            <Link href="/spmb" className="hover:text-slate-400">
              Persyaratan SPMB
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-amber-400">
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
