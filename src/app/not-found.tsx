import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto shadow-sm">
          <Search className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
            Kesalahan 404
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Mohon maaf, halaman atau konten yang Anda tuju tidak tersedia, telah dipindahkan, atau status publikasinya belum diterbitkan.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/berita"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lihat Warta Sekolah</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
