'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  School,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface FacilityItem {
  id: number;
  nama: string;
  deskripsi: string | null;
  jumlah: number | null;
  kondisi: string | null;
  media_id: number | null;
  foto_url?: string;
  status: 'draf' | 'terbit';
}

export default function AdminFasilitasPage() {
  const [items, setItems] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FacilityItem | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    jumlah: 1,
    kondisi: 'Baik',
    media_id: null as number | null,
    foto_url: '',
    status: 'terbit' as 'draf' | 'terbit',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deletingItem, setDeletingItem] = useState<FacilityItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/facilities');
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gagal memuat fasilitas.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama: '',
      deskripsi: '',
      jumlah: 1,
      kondisi: 'Baik',
      media_id: null,
      foto_url: '',
      status: 'terbit',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FacilityItem) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi || '',
      jumlah: item.jumlah || 1,
      kondisi: item.kondisi || 'Baik',
      media_id: item.media_id,
      foto_url: item.foto_url || '',
      status: item.status,
    });
    setIsModalOpen(true);
  };

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
          media_id: data.data.id,
          foto_url: data.data.file_path,
        }));
      } else {
        alert(data.message || 'Gagal mengunggah foto');
      }
    } catch {
      alert('Gagal mengunggah foto');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert('Nama fasilitas wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const bodyData = editingItem ? { id: editingItem.id, ...formData } : formData;

      const res = await fetch('/api/facilities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Data berhasil disimpan.' });
        setIsModalOpen(false);
        loadData();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan fasilitas.' });
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
      const res = await fetch(`/api/facilities?id=${deletingItem.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Data berhasil dihapus.' });
        setDeletingItem(null);
        loadData();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menghapus fasilitas.' });
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
            <School className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Data</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sarana &amp; Prasarana Sekolah</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola fasilitas penunjang belajar mengajar: ruang kelas, laboratorium chromebook, lapangan, UKS, dan perpustakaan.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas</span>
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
                <th className="py-3.5 px-4 w-16">Foto</th>
                <th className="py-3.5 px-4">Nama Sarana / Ruangan</th>
                <th className="py-3.5 px-4 w-24">Jumlah</th>
                <th className="py-3.5 px-4 w-32">Kondisi</th>
                <th className="py-3.5 px-4 w-24 text-center">Status</th>
                <th className="py-3.5 px-4 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Memuat fasilitas...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Belum ada data fasilitas.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200">
                        <ImageWithFallback
                          src={item.foto_url}
                          alt={item.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.nama}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {item.jumlah ? `${item.jumlah} Unit/Ruang` : '-'}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {item.kondisi ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {item.kondisi}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Ubah fasilitas"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus fasilitas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editingItem ? 'Ubah Fasilitas' : 'Tambah Fasilitas Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Sarana / Prasarana <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  placeholder="Contoh: Laboratorium Chromebook"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jumlah Unit / Ruang
                  </label>
                  <input
                    type="number"
                    value={formData.jumlah || ''}
                    onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kondisi
                  </label>
                  <input
                    type="text"
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                    placeholder="Contoh: Baik / Sangat Baik"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
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

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Foto Fasilitas <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200 flex-shrink-0">
                    <ImageWithFallback
                      src={formData.foto_url}
                      alt="Foto fasilitas"
                      fill
                      className="object-cover"
                    />
                    {formData.foto_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, media_id: null, foto_url: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
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
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{formData.foto_url ? 'Ganti Foto' : 'Unggah Foto'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deskripsi / Spesifikasi
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsikan sarana penunjang..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
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
                  disabled={saving}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Fasilitas</span>
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
                Yakin ingin menghapus sarana &ldquo;<span className="font-semibold text-slate-800">{deletingItem.nama}</span>&rdquo;? Data yang dihapus tidak dapat dikembalikan.
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
                <span>Ya, Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
