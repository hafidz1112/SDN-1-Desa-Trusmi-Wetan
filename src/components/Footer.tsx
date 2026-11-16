import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Clock, ChevronRight, UserCheck, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#081d3d] text-blue-100/90 pt-16 pb-8 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Identity & Social */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl p-1 border border-blue-400/30 flex items-center justify-center">
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
                  NPSN: 20215577 • Akreditasi A
                </span>
              </div>
            </div>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Membentuk generasi peserta didik yang berakhlak mulia, cerdas, berprestasi, dan berkarakter unggul di Kabupaten Cirebon.
            </p>
            <div className="flex items-center space-x-2.5 pt-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-950 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-blue-200 transition-colors border border-blue-800/50"
                aria-label="WhatsApp SDN 1 Trusmi Wetan"
                title="Hubungi via WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:sdn1trusmiwetan@gmail.com"
                className="w-8 h-8 rounded-full bg-blue-950 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center text-blue-200 transition-colors border border-blue-800/50"
                aria-label="Email SDN 1 Trusmi Wetan"
                title="Kirim Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-blue-800/60 inline-block text-amber-400">
              Tautan Cepat
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/profil" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Profil &amp; Sambutan Kepala Sekolah</span>
                </Link>
              </li>
              <li>
                <Link href="/identitas" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Identitas &amp; Akreditasi Sekolah</span>
                </Link>
              </li>
              <li>
                <Link href="/kelas-guru" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Rombel &amp; Tenaga Pendidik</span>
                </Link>
              </li>
              <li>
                <Link href="/sarana-prasarana" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Fasilitas &amp; Sarana Prasarana</span>
                </Link>
              </li>
              <li>
                <Link href="/ekstrakurikuler" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
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
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-blue-800/60 inline-block text-amber-400">
              Informasi Publik
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/berita" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Warta &amp; Berita Terkini</span>
                </Link>
              </li>
              <li>
                <Link href="/kegiatan" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Agenda Kegiatan Sekolah</span>
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Etalase Prestasi Siswa</span>
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Galeri &amp; Dokumentasi Visual</span>
                </Link>
              </li>
              <li>
                <Link href="/spmb" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Program Bantuan PIP / KIP</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-blue-800/60 inline-block text-amber-400">
              Kantor Sekolah
            </h3>
            <ul className="space-y-3 text-xs text-blue-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Desa Trusmi Wetan, Kec. Plered, Kab. Cirebon, Jawa Barat 45154</span>
              </li>
              <li className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">Kepala Sekolah: Hj. Marpuah, S.Pd.</span>
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
        <div className="pt-8 border-t border-blue-900/40 text-xs text-blue-300/60 flex flex-col sm:flex-row justify-between items-center gap-4">
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
