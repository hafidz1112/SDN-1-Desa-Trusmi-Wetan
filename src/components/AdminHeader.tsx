'use client';

import React from 'react';
import { Menu, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  adminName?: string;
}

export default function AdminHeader({ onToggleSidebar, adminName = 'Pak Niko Rindi Mulyana' }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Yakin ingin keluar dari dashboard admin?')) {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          type="button"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle menu sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600 hidden sm:block" />
          <h1 className="text-base font-semibold text-slate-800">
            Sistem Kelola SDN 1 Trusmi Wetan
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Lihat Website
        </Link>

        <div className="flex items-center pl-3 border-l border-slate-200 space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
            {adminName.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-slate-800 leading-tight">
              {adminName}
            </span>
            <span className="block text-[11px] text-slate-500">
              Super Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
