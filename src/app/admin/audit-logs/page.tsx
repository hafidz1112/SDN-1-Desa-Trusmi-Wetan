'use client';

import React, { useState, useEffect } from 'react';
import { History, Loader2, Filter } from 'lucide-react';

interface AuditLogItem {
  id: number;
  user_id: number | null;
  admin_username: string | null;
  admin_nama: string | null;
  aksi: string;
  modul: string;
  entitas_id: number | null;
  ringkasan: string | null;
  waktu: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modulFilter, setModulFilter] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/audit-logs', window.location.origin);
      if (modulFilter) url.searchParams.set('modul', modulFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data.success) {
        setLogs(data.data || []);
      }
    } catch {
      console.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [modulFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-slate-600 mb-1">
          <History className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Audit Log Sistem</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Catatan Aktivitas Super Admin</h1>
        <p className="text-sm text-slate-500 mt-1">
          Rekaman riwayat aksi penambahan, perubahan, dan penghapusan data oleh Super Admin (FR-ADM-041 &amp; FR-ADM-042).
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Saring Berdasarkan Modul:</span>
          <select
            value={modulFilter}
            onChange={(e) => setModulFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Semua Modul</option>
            <option value="Berita">Berita</option>
            <option value="Prestasi">Prestasi</option>
            <option value="Kegiatan">Kegiatan</option>
            <option value="Galeri">Galeri</option>
            <option value="Persyaratan SPMB">Persyaratan SPMB</option>
            <option value="Jadwal SPMB">Jadwal SPMB</option>
            <option value="Pamflet SPMB">Pamflet SPMB</option>
            <option value="Misi">Misi</option>
            <option value="Ekstrakurikuler">Ekstrakurikuler</option>
            <option value="Fasilitas">Fasilitas</option>
            <option value="Guru & Tendik">Guru &amp; Tendik</option>
            <option value="Kelas & Rombel">Kelas &amp; Rombel</option>
            <option value="Auth">Autentikasi</option>
          </select>
        </div>
      </div>

      {/* Table Listing */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-40">Waktu</th>
                <th className="py-3.5 px-4 w-32">Pengguna</th>
                <th className="py-3.5 px-4 w-28 text-center">Aksi</th>
                <th className="py-3.5 px-4 w-40">Modul</th>
                <th className="py-3.5 px-4">Ringkasan Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Memuat catatan aktivitas...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Belum ada catatan aktivitas.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {log.waktu}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-900">
                      {log.admin_nama || log.admin_username || 'Sistem'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          log.aksi === 'tambah'
                            ? 'bg-blue-100 text-blue-800'
                            : log.aksi === 'ubah'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.aksi}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                      {log.modul}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {log.ringkasan || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
