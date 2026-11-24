'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Clock,
  UserCheck,
  Home,
  PhoneCall,
  GraduationCap,
  FileText,
  Trophy,
  CalendarDays,
  Images,
  ClipboardList,
  CalendarCheck,
  FileSpreadsheet,
  Target,
  Sparkles,
  School,
  Users,
  Layers,
  KeyRound,
  History,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings?type=identity')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data?.identity?.logo_url) {
          setLogoUrl(data.data.identity.logo_url);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    if (confirm('Yakin ingin keluar dari dashboard admin?')) {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    }
  };

  const navGroups = [
    {
      title: 'Utama',
      items: [
        { label: 'Ringkasan Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Data Tunggal (Profil)',
      items: [
        { label: 'Identitas Sekolah', href: '/admin/identitas', icon: Building2 },
        { label: 'Jam Operasional', href: '/admin/jam-operasional', icon: Clock },
        { label: 'Profil & Sambutan', href: '/admin/profil', icon: UserCheck },
        { label: 'Pengaturan Beranda', href: '/admin/beranda', icon: Home },
        { label: 'Kontak & Medsos', href: '/admin/kontak', icon: PhoneCall },
        { label: 'Pengaturan SPMB', href: '/admin/spmb-pengaturan', icon: GraduationCap },
      ],
    },
    {
      title: 'Koleksi Konten',
      items: [
        { label: 'Berita & Pengumuman', href: '/admin/berita', icon: FileText },
        { label: 'Prestasi', href: '/admin/prestasi', icon: Trophy },
        { label: 'Kegiatan Sekolah', href: '/admin/kegiatan', icon: CalendarDays },
        { label: 'Galeri Foto', href: '/admin/galeri', icon: Images },
        { label: 'Persyaratan SPMB', href: '/admin/spmb-persyaratan', icon: ClipboardList },
        { label: 'Jadwal SPMB', href: '/admin/spmb-jadwal', icon: CalendarCheck },
        { label: 'Pamflet SPMB', href: '/admin/pamflet', icon: FileSpreadsheet },
        { label: 'Poin Misi', href: '/admin/misi', icon: Target },
        { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler', icon: Sparkles },
        { label: 'Sarana & Prasarana', href: '/admin/fasilitas', icon: School },
        { label: 'Guru & Staf', href: '/admin/guru', icon: Users },
        { label: 'Kelas & Rombel', href: '/admin/kelas', icon: Layers },
      ],
    },
    {
      title: 'Sistem',
      items: [
        { label: 'Ubah Kata Sandi', href: '/admin/kata-sandi', icon: KeyRound },
        { label: 'Catatan Aktivitas', href: '/admin/audit-logs', icon: History },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800">
      {/* Brand header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" onClick={onCloseMobile} className="flex items-center space-x-3">
          <div className="w-10 h-10 relative flex-shrink-0 bg-white rounded-xl p-1.5 shadow-sm border border-slate-700/60 flex items-center justify-center overflow-hidden">
            <ImageWithFallback
              src={logoUrl || '/images/logo.svg'}
              fallbackSrc="/images/logo.svg"
              alt="Logo"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <span className="block font-bold text-white text-sm leading-tight">
              ADMIN PANEL
            </span>
            <span className="block text-xs text-amber-400 font-medium">
              SDN 1 Trusmi Wetan
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-sm">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              {group.title}
            </div>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer action */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            Buka Website Publik
          </span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600/80 rounded-lg transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar (Logout)
        </button>
      </div>
    </aside>
  );
}
