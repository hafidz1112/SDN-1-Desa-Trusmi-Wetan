'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface NewsItem {
  id: number;
  judul: string;
  slug: string;
  isi: string;
  tanggal: string;
  media_id: number | null;
  foto_url?: string;
  status: 'draf' | 'terbit';
}

export default function AdminBeritaPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    tanggal: new Date().toISOString().split('T')[0],
    media_id: null as number | null,
    foto_url: '',
    status: 'terbit' as 'draf' | 'terbit',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Delete Confirm State
  const [deletingItem, setDeletingItem] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const url = new URL('/api/news', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '10');
      if (search) url.searchParams.set('q', search);
      if (statusFilter) url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gagal memuat daftar berita.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [search, statusFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      isi: '',
      tanggal: new Date().toISOString().split('T')[0],
      media_id: null,
      foto_url: '',
      status: 'terbit',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      isi: item.isi,
      tanggal: item.tanggal,
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
        alert(data.message || 'Format atau ukuran berkas tidak valid.');
      }
    } catch {
      alert('Gagal mengunggah gambar ke server.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.isi.trim()) {
      alert('Judul dan isi berita wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const bodyData = editingItem ? { id: editingItem.id, ...formData } : formData;

      const res = await fetch('/api/news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Data berhasil disimpan.' });
        setIsModalOpen(false);
        loadData(pagination.page);
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan berita.' });
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
      const res = await fetch(`/api/news?id=${deletingItem.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Data berhasil dihapus.' });
        setDeletingItem(null);
        loadData(pagination.page);
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menghapus berita.' });
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
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Data</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Berita &amp; Pengumuman Sekolah</h1>
          <p className="text-sm text-slate-500 mt-1">
            Publikasikan kabar terbaru, agenda kegiatan, pengumuman libur akademik, dan edaran bagi orang tua.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Berita Baru</span>
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

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau isi berita..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-auto"
          >
            <option value="">Semua Status</option>
            <option value="terbit">Terbit</option>
            <option value="draf">Draf</option>
          </select>
        </div>
      </div>

      {/* Table Listing */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-16">Foto</th>
                <th className="py-3.5 px-4">Judul Berita</th>
                <th className="py-3.5 px-4 w-32">Tanggal</th>
                <th className="py-3.5 px-4 w-28 text-center">Status</th>
                <th className="py-3.5 px-4 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Memuat data berita...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Belum ada data berita.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200">
                        <ImageWithFallback
                          src={item.foto_url}
                          alt={item.judul}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="line-clamp-1">{item.judul}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">/berita/{item.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {item.tanggal}
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
                          title="Ubah berita"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus berita"
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan {items.length} dari {pagination.total} berita
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => loadData(p)}
                  className={`w-7 h-7 rounded-md font-medium ${
                    pagination.page === p
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingItem ? 'Ubah Berita' : 'Tambah Berita Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  required
                  placeholder="Masukkan judul berita atau pengumuman..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Terbit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
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
                    <option value="terbit">Terbit (Tampil di Publik)</option>
                    <option value="draf">Draf (Disimpan Internal)</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload (Optional, BR-09) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Foto Berita <span className="text-slate-400 font-normal">(Opsional - Placeholder otomatis jika kosong)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200 flex-shrink-0">
                    <ImageWithFallback
                      src={formData.foto_url}
                      alt="Pratinjau foto berita"
                      fill
                      className="object-cover"
                    />
                    {formData.foto_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, media_id: null, foto_url: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                        title="Hapus foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
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
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{formData.foto_url ? 'Ganti Foto' : 'Unggah Foto'}</span>
                    </button>
                    <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP. Maks 5 MB.</p>
                  </div>
                </div>
              </div>

              {/* Rich/Plain text Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Isi Berita Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  required
                  placeholder="Tuliskan isi berita secara lengkap dan jelas..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Berita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog (UI-04 & MSG-04) */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-slate-500 mt-1">
                Yakin ingin menghapus &ldquo;<span className="font-semibold text-slate-800">{deletingItem.judul}</span>&rdquo;? Data yang dihapus tidak dapat dikembalikan.
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
