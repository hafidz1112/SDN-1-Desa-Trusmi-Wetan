'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Images,
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle2,
  FolderPlus,
} from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface GalleryItem {
  id: number;
  media_id: number;
  foto_url: string;
  original_name?: string;
  keterangan: string | null;
  album_id: number | null;
  nama_album: string | null;
  status: 'draf' | 'terbit';
}

interface Album {
  id: number;
  nama_album: string;
  item_count: number;
}

export default function AdminGaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumFilter, setAlbumFilter] = useState('');

  // Upload Photo Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    media_id: null as number | null,
    foto_url: '',
    keterangan: '',
    album_id: '' as string,
    status: 'terbit' as 'draf' | 'terbit',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // New Album Modal
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [savingAlbum, setSavingAlbum] = useState(false);

  // Delete Item State
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [galeriRes, albumRes] = await Promise.all([
        fetch(`/api/gallery${albumFilter ? `?album_id=${albumFilter}` : ''}`),
        fetch('/api/gallery/albums'),
      ]);

      const [galeriData, albumData] = await Promise.all([galeriRes.json(), albumRes.json()]);

      if (galeriData.success) setItems(galeriData.data || []);
      if (albumData.success) setAlbums(albumData.data || []);
    } catch {
      setFeedback({ type: 'error', message: 'Gagal memuat galeri.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [albumFilter]);

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

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.media_id) {
      alert('Foto wajib diunggah untuk galeri (FR-ADM-028 & FR-ADM-033).');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_id: formData.media_id,
          keterangan: formData.keterangan,
          album_id: formData.album_id ? Number(formData.album_id) : null,
          status: formData.status,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Foto berhasil ditambahkan ke galeri.' });
        setIsModalOpen(false);
        setFormData({ media_id: null, foto_url: '', keterangan: '', album_id: '', status: 'terbit' });
        loadData();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan foto.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;

    setSavingAlbum(true);
    try {
      const res = await fetch('/api/gallery/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_album: newAlbumName.trim() }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Album berhasil dibuat.' });
        setIsAlbumModalOpen(false);
        setNewAlbumName('');
        loadData();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gagal membuat album.' });
    } finally {
      setSavingAlbum(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/gallery?id=${deletingItem.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Foto berhasil dihapus.' });
        setDeletingItem(null);
        loadData();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gagal menghapus foto.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Images className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Data</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Galeri Foto &amp; Album Sekolah</h1>
          <p className="text-sm text-slate-500 mt-1">
            Unggah dan kelompokkan dokumentasi foto kegiatan, sarana prasarana, dan prestasi ke dalam album sekolah.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Buat Album</span>
          </button>
          <button
            onClick={() => {
              setFormData({ media_id: null, foto_url: '', keterangan: '', album_id: '', status: 'terbit' });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Foto</span>
          </button>
        </div>
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

      {/* Album Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setAlbumFilter('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            albumFilter === ''
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua Album ({items.length})
        </button>
        {albums.map((alb) => (
          <button
            key={alb.id}
            onClick={() => setAlbumFilter(alb.id.toString())}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              albumFilter === alb.id.toString()
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {alb.nama_album} ({alb.item_count})
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            <span>Memuat galeri foto...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Images className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>Belum ada foto dalam galeri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-square shadow-sm"
              >
                <ImageWithFallback
                  src={item.foto_url}
                  alt={item.keterangan || 'Foto galeri'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
                      title="Hapus foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <span className="block text-[11px] text-white font-medium line-clamp-1">
                      {item.keterangan || 'Tanpa keterangan'}
                    </span>
                    <span className="block text-[10px] text-blue-200 font-medium">
                      {item.nama_album || 'Umum'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Upload Photo (FR-ADM-028: Foto Wajib) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Unggah Foto Galeri</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Foto <span className="text-red-500">* (Wajib)</span>
                </label>
                <div className="relative w-full h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-2 flex items-center justify-center">
                  {formData.foto_url ? (
                    <ImageWithFallback
                      src={formData.foto_url}
                      alt="Pratinjau foto"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-4">
                      <Images className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                      <span className="text-xs">Foto belum dipilih</span>
                    </div>
                  )}
                </div>
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
                  className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{formData.foto_url ? 'Ganti Berkas Foto' : 'Pilih Berkas Foto'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Album
                </label>
                <select
                  value={formData.album_id}
                  onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">-- Tanpa Album (Umum) --</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nama_album}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Keterangan Foto <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Contoh: Upacara Bendera HUT RI ke-81"
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
                  disabled={saving || !formData.media_id}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan ke Galeri</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Album */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Buat Album Baru</h2>
              <button onClick={() => setIsAlbumModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Album
                </label>
                <input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  required
                  placeholder="Contoh: Pentas Seni Batik Trusmi"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingAlbum}
                  className="px-4 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow"
                >
                  {savingAlbum ? 'Menyimpan...' : 'Simpan Album'}
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
                Yakin ingin menghapus foto ini dari galeri? Data yang dihapus tidak dapat dikembalikan.
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
                onClick={handleDeleteItem}
                disabled={deleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Ya, Hapus Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
