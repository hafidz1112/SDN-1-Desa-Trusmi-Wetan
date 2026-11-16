'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, Save, Loader2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function AdminBerandaPage() {
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_media_id: null as number | null,
    hero_media_url: '',
    intro_text: '',
    stat_siswa: 312,
    stat_guru: 16,
    stat_rombel: 12,
    stat_prestasi: 20,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings?type=beranda')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data.beranda) {
          const b = data.data.beranda;
          setFormData({
            hero_title: b.hero_title || '',
            hero_subtitle: b.hero_subtitle || '',
            hero_media_id: b.hero_media_id || null,
            hero_media_url: b.hero_media_url || '',
            intro_text: b.intro_text || '',
            stat_siswa: b.stat_siswa ?? 312,
            stat_guru: b.stat_guru ?? 16,
            stat_rombel: b.stat_rombel ?? 12,
            stat_prestasi: b.stat_prestasi ?? 20,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFileUpload = async (file: File) => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev) => ({
          ...prev,
          hero_media_id: data.data.id,
          hero_media_url: data.data.file_path,
        }));
      } else {
        alert(data.message || 'Gagal mengunggah gambar');
      }
    } catch {
      alert('Gagal mengunggah berkas');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'beranda', data: formData }),
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
          <Home className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Data Tunggal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Halaman Beranda</h1>
        <p className="text-sm text-slate-500 mt-1">
          Atur tampilan banner utama (hero), kutipan pembuka, serta angka statistik ringkas yang tampil di Beranda publik.
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
        {/* Banner Hero */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Banner Utama (Hero)
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Gambar Latar Banner <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <div className="relative w-full h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3">
              <ImageWithFallback
                src={formData.hero_media_url}
                alt="Banner Hero Beranda"
                fill
                className="object-cover"
              />
              {formData.hero_media_url && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hero_media_id: null, hero_media_url: '' })}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                  title="Hapus gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={bannerInputRef}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploading}
              className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{formData.hero_media_url ? 'Ganti Gambar Banner' : 'Unggah Gambar Banner'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Judul Banner
              </label>
              <input
                type="text"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                placeholder="Contoh: Membentuk Generasi Berkarakter, Cerdas, dan Berbudaya"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Subjudul / Slogan Banner
              </label>
              <input
                type="text"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                placeholder="Contoh: Selamat Datang di Website Resmi SDN 1 Trusmi Wetan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Intro Text */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Ringkasan Profil Pembuka
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Teks Pengantar di Beranda
            </label>
            <textarea
              rows={4}
              value={formData.intro_text}
              onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
              placeholder="Teks singkat yang merangkum keunggulan dan semangat sekolah..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Manual Stats */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Statistik Ringkas Beranda
          </h2>
          <p className="text-xs text-slate-500">
            Hanya angka yang diisi yang akan ditampilkan pada pita statistik beranda (FR-PUB-014).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Siswa
              </label>
              <input
                type="number"
                value={formData.stat_siswa || ''}
                onChange={(e) => setFormData({ ...formData, stat_siswa: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Guru &amp; Staf
              </label>
              <input
                type="number"
                value={formData.stat_guru || ''}
                onChange={(e) => setFormData({ ...formData, stat_guru: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Rombel
              </label>
              <input
                type="number"
                value={formData.stat_rombel || ''}
                onChange={(e) => setFormData({ ...formData, stat_rombel: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Prestasi
              </label>
              <input
                type="number"
                value={formData.stat_prestasi || ''}
                onChange={(e) => setFormData({ ...formData, stat_prestasi: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Pengaturan Beranda</span>
          </button>
        </div>
      </form>
    </div>
  );
}
