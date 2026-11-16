'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminIdentitasPage() {
  const [formData, setFormData] = useState({
    nama_sekolah: '',
    npsn: '',
    status_sekolah: '',
    akreditasi: '',
    alamat: '',
    maps_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings?type=identity')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data.identity) {
          setFormData({
            nama_sekolah: data.data.identity.nama_sekolah || '',
            npsn: data.data.identity.npsn || '',
            status_sekolah: data.data.identity.status_sekolah || '',
            akreditasi: data.data.identity.akreditasi || '',
            alamat: data.data.identity.alamat || '',
            maps_url: data.data.identity.maps_url || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.nama_sekolah.trim()) {
      setFeedback({ type: 'error', message: 'Kolom Nama Sekolah wajib diisi.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'identity', data: formData }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Data berhasil disimpan.' });
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan data.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan pada server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Building2 className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Data Tunggal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Identitas &amp; Akreditasi Sekolah</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola data nama resmi, NPSN, status, akreditasi, serta lokasi sekolah untuk ditampilkan di halaman publik.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Nama Sekolah <span className="text-red-500">* (Wajib)</span>
            </label>
            <input
              type="text"
              value={formData.nama_sekolah}
              onChange={(e) => setFormData({ ...formData, nama_sekolah: e.target.value })}
              required
              placeholder="Contoh: SDN 1 Trusmi Wetan"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              NPSN <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={formData.npsn}
              onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
              placeholder="Contoh: 20215000"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Status Sekolah <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={formData.status_sekolah}
              onChange={(e) => setFormData({ ...formData, status_sekolah: e.target.value })}
              placeholder="Contoh: Negeri"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Peringkat Akreditasi <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={formData.akreditasi}
              onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
              placeholder="Contoh: A (Unggul)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tautan Google Maps <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="url"
              value={formData.maps_url}
              onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Alamat Lengkap Sekolah <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              placeholder="Masukkan alamat lengkap sekolah..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
