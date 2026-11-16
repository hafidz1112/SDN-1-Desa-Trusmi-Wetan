import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0b3b2c] flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Kesalahan 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#0b3b2c] tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Mohon maaf, halaman atau konten yang Anda tuju tidak tersedia, telah dipindahkan, atau status publikasinya belum diterbitkan.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0b3b2c] hover:bg-[#07291f] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <Link
            href="/berita"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Warta Sekolah</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
