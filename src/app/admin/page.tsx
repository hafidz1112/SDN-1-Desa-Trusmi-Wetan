'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Trophy,
  CalendarDays,
  Images,
  GraduationCap,
  Users,
  Layers,
  PlusCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-blue-800/80 text-blue-200 text-xs font-semibold rounded-full mb-3">
            Dashboard Super Admin
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat Datang di Portal Pengelolaan Sekolah
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Kelola seluruh informasi resmi profil, kegiatan, prestasi, sarana prasarana, serta informasi SPMB SDN 1 Trusmi Wetan dengan mudah dan cepat.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Tampilan Website Publik
            </Link>
            <Link
              href="/admin/berita"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700/80 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Tulis Berita Baru
            </Link>
          </div>
        </div>
      </div>

      {/* SPMB Status Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Status Pendaftaran SPMB
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  stats?.spmb?.status === 'dibuka'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {stats?.spmb?.status === 'dibuka' ? 'SEDANG DIBUKA' : 'DITUTUP'}
              </span>
              <span className="text-xs text-slate-500">
                (Pengunjung hanya dapat melihat informasi resmi)
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/admin/spmb-pengaturan"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Ubah Status SPMB <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Ringkasan Data Konten
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Berita */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Berita &amp; Pengumuman</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {loading ? '...' : stats?.news?.total || 0}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {stats?.news?.terbit || 0} Terbit • {stats?.news?.draf || 0} Draf
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <Link
              href="/admin/berita"
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-800"
            >
              <span>Kelola Berita</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Prestasi */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Prestasi Sekolah</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {loading ? '...' : stats?.achievements?.total || 0}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {stats?.achievements?.terbit || 0} Terbit di Publik
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <Link
              href="/admin/prestasi"
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600 group-hover:text-amber-800"
            >
              <span>Kelola Prestasi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Kegiatan */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Kegiatan Sekolah</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {loading ? '...' : stats?.activities?.total || 0}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Termasuk kegiatan rutin
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <Link
              href="/admin/kegiatan"
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-800"
            >
              <span>Kelola Kegiatan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Galeri */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Galeri Foto</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {loading ? '...' : stats?.gallery?.total || 0}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Dokumentasi visual
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Images className="w-5 h-5" />
              </div>
            </div>
            <Link
              href="/admin/galeri"
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600 group-hover:text-purple-800"
            >
              <span>Kelola Galeri</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Shortcuts (FR-ADM-011) */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Pintasan Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/berita"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-800">
                Tambah Berita
              </span>
              <span className="block text-xs text-slate-400">
                Publikasikan edaran &amp; kabar
              </span>
            </div>
          </Link>

          <Link
            href="/admin/prestasi"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-sm transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-800">
                Tambah Prestasi
              </span>
              <span className="block text-xs text-slate-400">
                Catat piagam &amp; kejuaraan
              </span>
            </div>
          </Link>

          <Link
            href="/admin/kegiatan"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-800">
                Tambah Kegiatan
              </span>
              <span className="block text-xs text-slate-400">
                Agenda atau kegiatan rutin
              </span>
            </div>
          </Link>

          <Link
            href="/admin/spmb-jadwal"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-800">
                Atur Jadwal SPMB
              </span>
              <span className="block text-xs text-slate-400">
                Pendaftaran &amp; daftar ulang
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
