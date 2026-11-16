'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface ClassItem {
  id: number;
  nama_rombel: string;
  wali_kelas_id: number | null;
  wali_kelas_nama?: string;
  jumlah_siswa: number | null;
  urutan: number;
  status: 'draf' | 'terbit';
}

interface StaffOption {
  id: number;
  nama: string;
  jabatan: string;
}

export default function AdminKelasPage() {
  const [items, setItems] = useState<ClassItem[]>([]);
  const [staffList, setStaffList] = useState<StaffOption[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassItem | null>(null);
  const [formData, setFormData] = useState({
    nama_rombel: '',
    wali_kelas_id: '' as string,
    jumlah_siswa: 26,
    urutan: 0,
    status: 'terbit' as 'draf' | 'terbit',
  });
  const [saving, setSaving] = useState(false);

  const [deletingItem, setDeletingItem] = useState<ClassItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classRes, staffRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/staff'),
      ]);

      const [classData, staffData] = await Promise.all([classRes.json(), staffRes.json()]);

      if (classData.success) {
        setItems(classData.data || []);
        setTotalStudents(classData.summary?.totalSiswa || 0);
      }
      if (staffData.success) {
        setStaffList(staffData.data || []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gagal memuat data rombel.' });
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
      nama_rombel: '',
      wali_kelas_id: '',
      jumlah_siswa: 25,
      urutan: items.length + 1,
      status: 'terbit',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ClassItem) => {
    setEditingItem(item);
    setFormData({
      nama_rombel: item.nama_rombel,
      wali_kelas_id: item.wali_kelas_id ? item.wali_kelas_id.toString() : '',
      jumlah_siswa: item.jumlah_siswa || 0,
      urutan: item.urutan,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_rombel.trim()) {
      alert('Nama rombel wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const bodyData = {
        ...(editingItem ? { id: editingItem.id } : {}),
        nama_rombel: formData.nama_rombel,
        wali_kelas_id: formData.wali_kelas_id ? Number(formData.wali_kelas_id) : null,
        jumlah_siswa: formData.jumlah_siswa ? Number(formData.jumlah_siswa) : null,
        urutan: formData.urutan,
        status: formData.status,
      };

      const res = await fetch('/api/classes', {
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
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan rombel.' });
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
      const res = await fetch(`/api/classes?id=${deletingItem.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Data berhasil dihapus.' });
        setDeletingItem(null);
        loadData();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menghapus rombel.' });
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
            <Layers className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Data</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Rombongan Belajar (Rombel)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola daftar rombel kelas 1 sampai 6, penugasan wali kelas, dan jumlah siswa per kelas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold">
            Total Siswa Terhitung: <span className="text-blue-700 font-bold">{totalStudents}</span>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rombel</span>
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

      {/* Table Listing */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-20 text-center">Urutan</th>
                <th className="py-3.5 px-4">Nama Rombel</th>
                <th className="py-3.5 px-4">Wali Kelas</th>
                <th className="py-3.5 px-4 w-32">Jumlah Siswa</th>
                <th className="py-3.5 px-4 w-24 text-center">Status</th>
                <th className="py-3.5 px-4 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Memuat data rombel...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Belum ada data rombel.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-500">
                      {item.urutan}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.nama_rombel}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">
                      {item.wali_kelas_nama ? (
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          {item.wali_kelas_nama}
                        </span>
                      ) : (
                        <span className="text-slate-400">Belum ditentukan</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-800">
                      {item.jumlah_siswa ? `${item.jumlah_siswa} Siswa` : '-'}
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
                          title="Ubah rombel"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus rombel"
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
                {editingItem ? 'Ubah Rombel' : 'Tambah Rombel Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Rombel / Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_rombel}
                  onChange={(e) => setFormData({ ...formData, nama_rombel: e.target.value })}
                  required
                  placeholder="Contoh: Kelas 1A"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Wali Kelas <span className="text-slate-400 font-normal">(Dari Data Guru)</span>
                </label>
                <select
                  value={formData.wali_kelas_id}
                  onChange={(e) => setFormData({ ...formData, wali_kelas_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">-- Belum Ditentukan --</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.nama} ({st.jabatan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jumlah Siswa (Angka Saja)
                  </label>
                  <input
                    type="number"
                    value={formData.jumlah_siswa || ''}
                    onChange={(e) => setFormData({ ...formData, jumlah_siswa: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Contoh: 26"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Sistem tidak menyimpan data pribadi siswa (BR-06).</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    value={formData.urutan}
                    onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value, 10) || 0 })}
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
                  <span>Simpan Rombel</span>
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
                Yakin ingin menghapus rombel &ldquo;<span className="font-semibold text-slate-800">{deletingItem.nama_rombel}</span>&rdquo;? Data yang dihapus tidak dapat dikembalikan.
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
