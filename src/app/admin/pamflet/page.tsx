'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileText,
  Download,
} from 'lucide-react';

interface BrochureItem {
  id: number;
  judul: string;
  media_id: number;
  tahun: number;
  file_url: string;
  original_name?: string;
  mime_type?: string;
  status: 'draf' | 'terbit';
}

export default function AdminPamfletPage() {
  const [items, setItems] = useState<BrochureItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    tahun: 2026,
    media_id: null as number | null,
    file_url: '',
    fileName: '',
    status: 'terbit' as 'draf' | 'terbit',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deletingItem, setDeletingItem] = useState<BrochureItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brochures');
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gagal memuat pamflet SPMB.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (file: File) => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('is_doc', 'true');
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
          media_id: data.data.id,
          file_url: data.data.file_path,
          fileName: data.data.original_name,
        }));
      } else {
        alert(data.message || 'Format berkas salah. Gunakan PDF, JPG, atau PNG (maks 10 MB).');
      }
    } catch {
      alert('Gagal mengunggah dokumen.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.media_id) {
      alert('Judul dan berkas dokumen/pamflet wajib diisi (FR-ADM-030).');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/brochures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: formData.judul,
          media_id: formData.media_id,
          tahun: formData.tahun,
          status: formData.status,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Pamflet berhasil disimpan.' });
        setIsModalOpen(false);
        setFormData({ judul: '', tahun: 2026, media_id: null, file_url: '', fileName: '', status: 'terbit' });
        loadData();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan pamflet.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/brochures?id=${deletingItem.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Pamflet berhasil dihapus.' });
        setDeletingItem(null);
        loadData();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menghapus pamflet.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan saat menghapus.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <FileSpreadsheet className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Data</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Pamflet &amp; Dokumen SPMB</h1>
          <p className="text-sm text-slate-500 mt-1">
            Unggah pamflet sosialisasi, brosur SPMB, atau berkas panduan pendaftaran yang dapat diunduh oleh masyarakat.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ judul: '', tahun: 2026, media_id: null, file_url: '', fileName: '', status: 'terbit' });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Pamflet Baru</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs text-slate-500 hover:text-slate-800">
            Tutup
          </button>
        </div>
      )}

      {/* Table Listing */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Judul Dokumen / Pamflet</th>
                <th className="py-3.5 px-4 w-28">Tahun</th>
                <th className="py-3.5 px-4 w-48">Berkas</th>
                <th className="py-3.5 px-4 w-28 text-center">Status</th>
                <th className="py-3.5 px-4 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Memuat pamflet...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Belum ada pamflet SPMB yang diunggah.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.judul}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">
                      {item.tahun}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh / Pratinjau</span>
                      </a>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.status === 'terbit'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status === 'terbit' ? 'Terbit' : 'Draf'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus pamflet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add (FR-ADM-030: Berkas Wajib) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Unggah Pamflet SPMB</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Dokumen / Pamflet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  required
                  placeholder="Contoh: Pamflet Informasi SPMB 2027/2028"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tahun Terbit
                  </label>
                  <input
                    type="number"
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value, 10) || 2026 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="terbit">Terbit</option>
                    <option value="draf">Draf</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Berkas Dokumen <span className="text-red-500">* (PDF, JPG, PNG maks 10 MB)</span>
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  {formData.fileName ? (
                    <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{formData.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, media_id: null, file_url: '', fileName: '' })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-500">Pilih berkas PDF atau gambar pamflet dari komputer</p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="py-2 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{formData.fileName ? 'Ganti Berkas' : 'Pilih Berkas Pamflet'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.media_id}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Pamflet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-slate-500 mt-1">
                Yakin ingin menghapus pamflet &ldquo;<span className="font-semibold text-slate-800">{deletingItem.judul}</span>&rdquo;? Berkas yang dihapus tidak dapat dikembalikan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Ya, Hapus Pamflet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
