'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, Save, Loader2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function AdminProfilPage() {
  const [formData, setFormData] = useState({
    nama_kepala_sekolah: '',
    sambutan: '',
    foto_kepsek_media_id: null as number | null,
    foto_kepsek_url: '',
    sejarah: '',
    sejarah_media_id: null as number | null,
    sejarah_foto_url: '',
    visi: '',
    tujuan: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKepsek, setUploadingKepsek] = useState(false);
  const [uploadingSejarah, setUploadingSejarah] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const kepsekInputRef = useRef<HTMLInputElement>(null);
  const sejarahInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings?type=profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data.profile) {
          const p = data.data.profile;
          setFormData({
            nama_kepala_sekolah: p.nama_kepala_sekolah || '',
            sambutan: p.sambutan || '',
            foto_kepsek_media_id: p.foto_kepsek_media_id || null,
            foto_kepsek_url: p.foto_kepsek_url || '',
            sejarah: p.sejarah || '',
            sejarah_media_id: p.sejarah_media_id || null,
            sejarah_foto_url: p.sejarah_foto_url || '',
            visi: p.visi || '',
            tujuan: p.tujuan || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFileUpload = async (file: File, type: 'kepsek' | 'sejarah') => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);

    if (type === 'kepsek') setUploadingKepsek(true);
    if (type === 'sejarah') setUploadingSejarah(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (type === 'kepsek') {
          setFormData((prev) => ({
            ...prev,
            foto_kepsek_media_id: data.data.id,
            foto_kepsek_url: data.data.file_path,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            sejarah_media_id: data.data.id,
            sejarah_foto_url: data.data.file_path,
          }));
        }
      } else {
        alert(data.message || 'Gagal mengunggah foto');
      }
    } catch {
      alert('Gagal mengunggah foto ke server');
    } finally {
      if (type === 'kepsek') setUploadingKepsek(false);
      if (type === 'sejarah') setUploadingSejarah(false);
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
        body: JSON.stringify({ type: 'profile', data: formData }),
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
          <UserCheck className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Data Tunggal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Profil, Sambutan &amp; Sejarah</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola sambutan kepala sekolah, foto pimpinan, sejarah sekolah, serta rumusan visi dan tujuan pendidikan.
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
        {/* Sambutan Kepala Sekolah */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Sambutan Kepala Sekolah
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Foto Kepala Sekolah
              </label>
              <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-2">
                <ImageWithFallback
                  src={formData.foto_kepsek_url}
                  alt="Foto Kepala Sekolah"
                  fill
                  className="object-cover"
                />
                {formData.foto_kepsek_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, foto_kepsek_media_id: null, foto_kepsek_url: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                    title="Hapus foto (gunakan placeholder)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={kepsekInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0], 'kepsek');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => kepsekInputRef.current?.click()}
                disabled={uploadingKepsek}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {uploadingKepsek ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{formData.foto_kepsek_url ? 'Ganti Foto' : 'Unggah Foto'}</span>
              </button>
            </div>

            <div className="sm:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.nama_kepala_sekolah}
                  onChange={(e) => setFormData({ ...formData, nama_kepala_sekolah: e.target.value })}
                  placeholder="Contoh: Hj. Marpuah, S.Pd."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Teks Sambutan
                </label>
                <textarea
                  rows={5}
                  value={formData.sambutan}
                  onChange={(e) => setFormData({ ...formData, sambutan: e.target.value })}
                  placeholder="Tuliskan kata sambutan kepala sekolah..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sejarah Singkat */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Sejarah Singkat Sekolah
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Foto Sejarah / Gedung
              </label>
              <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-2">
                <ImageWithFallback
                  src={formData.sejarah_foto_url}
                  alt="Foto Sejarah Sekolah"
                  fill
                  className="object-cover"
                />
                {formData.sejarah_foto_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sejarah_media_id: null, sejarah_foto_url: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                    title="Hapus foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={sejarahInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0], 'sejarah');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => sejarahInputRef.current?.click()}
                disabled={uploadingSejarah}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {uploadingSejarah ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{formData.sejarah_foto_url ? 'Ganti Foto' : 'Unggah Foto'}</span>
              </button>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Uraian Sejarah Singkat
              </label>
              <textarea
                rows={6}
                value={formData.sejarah}
                onChange={(e) => setFormData({ ...formData, sejarah: e.target.value })}
                placeholder="Tuliskan sejarah berdirinya sekolah, merger 3 SD, dan perkembangannya..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Visi & Tujuan */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Visi &amp; Tujuan
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Visi Sekolah
              </label>
              <textarea
                rows={3}
                value={formData.visi}
                onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                placeholder="Rumusan visi sekolah..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Tujuan Sekolah
              </label>
              <textarea
                rows={4}
                value={formData.tujuan}
                onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                placeholder="Poin-poin tujuan pendidikan sekolah..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            <span>Simpan Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
}
