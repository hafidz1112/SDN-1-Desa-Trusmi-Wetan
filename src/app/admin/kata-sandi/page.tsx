'use client';

import React, { useState } from 'react';
import { KeyRound, Save, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminKataSandiPage() {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      setFeedback({ type: 'error', message: 'Semua kolom wajib diisi.' });
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setFeedback({ type: 'error', message: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    // Rules according to FR-ADM-008 & UAT 13: >= 8 characters, letters and numbers (MSG-08)
    const hasLetter = /[a-zA-Z]/.test(formData.new_password);
    const hasNumber = /[0-9]/.test(formData.new_password);
    if (formData.new_password.length < 8 || !hasLetter || !hasNumber) {
      setFeedback({
        type: 'error',
        message: 'Kata sandi minimal 8 karakter dan memuat huruf serta angka. (MSG-08)',
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Kata sandi berhasil diperbarui.' });
        setFormData({ old_password: '', new_password: '', confirm_password: '' });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Gagal mengubah kata sandi.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <KeyRound className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Keamanan Akun</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Ubah Kata Sandi Super Admin</h1>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui kata sandi masuk dashboard untuk menjaga keamanan dan kerahasiaan pengelolaan data sekolah.
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Kata Sandi Lama <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.old_password}
            onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
            required
            placeholder="Masukkan kata sandi saat ini"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Kata Sandi Baru <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.new_password}
            onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
            required
            placeholder="Minimal 8 karakter (huruf dan angka)"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Wajib memuat minimal 8 karakter dengan kombinasi huruf dan angka (FR-ADM-008).</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.confirm_password}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            required
            placeholder="Ketik ulang kata sandi baru"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Kata Sandi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
