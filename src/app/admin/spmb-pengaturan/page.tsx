'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSpmbPengaturanPage() {
  const [formData, setFormData] = useState({
    status_pendaftaran: 'ditutup',
    teks_pengantar: '',
    info_pip_kip: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings?type=spmb')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data.spmb) {
          const s = data.data.spmb;
          setFormData({
            status_pendaftaran: s.status_pendaftaran || 'ditutup',
            teks_pengantar: s.teks_pengantar || '',
            info_pip_kip: s.info_pip_kip || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'spmb', data: formData }),
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
          <GraduationCap className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Data Tunggal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan SPMB &amp; Bantuan PIP/KIP</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tentukan status periode pendaftaran murid baru, pesan pengantar, serta informasi bantuan PIP/KIP bagi calon wali murid.
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Status Periode Pendaftaran Murid Baru
          </label>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <label
              className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                formData.status_pendaftaran === 'dibuka'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="status_pendaftaran"
                value="dibuka"
                checked={formData.status_pendaftaran === 'dibuka'}
                onChange={() => setFormData({ ...formData, status_pendaftaran: 'dibuka' })}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-sm block">Sedang Dibuka</span>
                <span className="text-xs text-slate-500 block">Menampilkan badge dibuka di website</span>
              </div>
            </label>

            <label
              className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                formData.status_pendaftaran === 'ditutup'
                  ? 'border-rose-600 bg-rose-50 text-rose-900'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="status_pendaftaran"
                value="ditutup"
                checked={formData.status_pendaftaran === 'ditutup'}
                onChange={() => setFormData({ ...formData, status_pendaftaran: 'ditutup' })}
                className="w-4 h-4 text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="font-bold text-sm block">Ditutup</span>
                <span className="text-xs text-slate-500 block">Status pendaftaran belum dibuka</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Teks Pengantar Halaman SPMB
          </label>
          <textarea
            rows={4}
            value={formData.teks_pengantar}
            onChange={(e) => setFormData({ ...formData, teks_pengantar: e.target.value })}
            placeholder="Informasikan prosedur singkat, lokasi pengambilan formulir langsung di sekolah, dan jadwal..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Informasi Bantuan PIP / KIP
          </label>
          <textarea
            rows={4}
            value={formData.info_pip_kip}
            onChange={(e) => setFormData({ ...formData, info_pip_kip: e.target.value })}
            placeholder="Jelaskan kemudahan dan pendampingan sekolah bagi siswa pemegang kartu bantuan Program Indonesia Pintar..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Informasi ini menjawab keraguan calon orang tua murid terkait ketersediaan dan pendampingan dana bantuan PIP/KIP.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Pengaturan SPMB</span>
          </button>
        </div>
      </form>
    </div>
  );
}
