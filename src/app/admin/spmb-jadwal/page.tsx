'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ScheduleItem {
  id: number;
  tahap: 'pendaftaran' | 'daftar_ulang';
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  keterangan: string | null;
  status: 'draf' | 'terbit';
}

export default function AdminSpmbJadwalPage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    tahap: 'pendaftaran' as 'pendaftaran' | 'daftar_ulang',
    tanggal_mulai: '',
    tanggal_selesai: '',
    keterangan: '',
    status: 'terbit' as 'draf' | 'terbit',
  });
  const [saving, setSaving] = useState(false);

  const [deletingItem, setDeletingItem] = useState<ScheduleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spmb/schedules');
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gagal memuat jadwal SPMB.' });
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
      tahap: 'pendaftaran',
      tanggal_mulai: new Date().toISOString().split('T')[0],
      tanggal_selesai: '',
      keterangan: '',
      status: 'terbit',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({
      tahap: item.tahap,
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai || '',
      keterangan: item.keterangan || '',
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tahap || !formData.tanggal_mulai) {
      alert('Tahap dan tanggal mulai wajib diisi.');
      return;
    }

    // Validation according to FR-ADM-025 & UAT 8: tanggal_selesai must not be before tanggal_mulai
    if (formData.tanggal_selesai && formData.tanggal_selesai < formData.tanggal_mulai) {
      alert('Tanggal selesai tidak boleh sebelum tanggal mulai. (MSG-11)');
      return;
    }

    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const bodyData = editingItem ? { id: editingItem.id, ...formData } : formData;

      const res = await fetch('/api/spmb/schedules', {
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
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan jadwal.' });
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
      const res = await fetch(`/api/spmb/schedules?id=${deletingItem.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Data berhasil dihapus.' });
        setDeletingItem(null);
        loadData();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menghapus jadwal.' });
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
            <CalendarCheck className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Data</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Jadwal &amp; Tahapan SPMB</h1>
          <p className="text-sm text-slate-500 mt-1">
            Atur rentang tanggal pelaksanaan tahap Pendaftaran serta tahap Daftar Ulang peserta didik baru.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
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
                <th className="py-3.5 px-4 w-40">Tahap</th>
                <th className="py-3.5 px-4 w-60">Rentang Tanggal</th>
                <th className="py-3.5 px-4">Keterangan / Lokasi</th>
                <th className="py-3.5 px-4 w-28 text-center">Status</th>
                <th className="py-3.5 px-4 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Memuat data jadwal...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Belum ada data jadwal SPMB.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.tahap === 'pendaftaran'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.tahap === 'pendaftaran' ? 'Pendaftaran' : 'Daftar Ulang'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-900 whitespace-nowrap">
                      {item.tanggal_mulai} {item.tanggal_selesai ? `s/d ${item.tanggal_selesai}` : ''}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {item.keterangan || '-'}
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
                          title="Ubah jadwal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus jadwal"
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
                {editingItem ? 'Ubah Jadwal SPMB' : 'Tambah Jadwal SPMB'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tahap SPMB <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tahap}
                  onChange={(e) => setFormData({ ...formData, tahap: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="pendaftaran">Pendaftaran</option>
                  <option value="daftar_ulang">Daftar Ulang</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Selesai <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Keterangan / Tempat Pelaksanaan <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Contoh: Di Ruang Panitia SPMB SDN 1 Trusmi Wetan (Pukul 08.00 - 12.00 WIB)"
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
                  <span>Simpan Jadwal</span>
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
                Yakin ingin menghapus jadwal {deletingItem.tahap === 'pendaftaran' ? 'Pendaftaran' : 'Daftar Ulang'} ({deletingItem.tanggal_mulai})? Data yang dihapus tidak dapat dikembalikan.
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
