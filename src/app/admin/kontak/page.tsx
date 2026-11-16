'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, Save, Loader2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function AdminKontakPage() {
  const [formData, setFormData] = useState({
    telepon_publik: '',
    email_publik: '',
    whatsapp: '',
    instagram_url: '',
    tiktok_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings?type=contact')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data.contact) {
          const c = data.data.contact;
          setFormData({
            telepon_publik: c.telepon_publik || '',
            email_publik: c.email_publik || '',
            whatsapp: c.whatsapp || '',
            instagram_url: c.instagram_url || '',
            tiktok_url: c.tiktok_url || '',
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
        body: JSON.stringify({ type: 'contact', data: formData }),
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
          <PhoneCall className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Data Tunggal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Kontak Resmi &amp; Media Sosial</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola kontak umum sekolah, nomor WhatsApp layanan informasi, email, dan akun media sosial resmi.
        </p>
      </div>

      {/* Privacy Warning according to SRS FR-ADM-017 & BR-05 */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-sm text-amber-900">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div>
          <span className="font-semibold block">Kebijakan Privasi (Aturan Bisnis BR-05):</span>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            Dilarang keras mencantumkan nomor telepon pribadi kepala sekolah. Gunakan hanya nomor resmi kantor tata usaha (TU), admin sekolah, atau nomor layanan pengaduan resmi.
          </p>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Telepon Kantor TU
            </label>
            <input
              type="text"
              value={formData.telepon_publik}
              onChange={(e) => setFormData({ ...formData, telepon_publik: e.target.value })}
              placeholder="Contoh: (0231) 321890"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Email Resmi Sekolah
            </label>
            <input
              type="email"
              value={formData.email_publik}
              onChange={(e) => setFormData({ ...formData, email_publik: e.target.value })}
              placeholder="Contoh: sdn1trusmiwetan@gmail.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Nomor WhatsApp Layanan (Format Internasional)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="Contoh: 6281234567890 (awali 62)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">Gunakan kode negara (62...) agar tautan pesan langsung dapat berfungsi.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              URL Profil Instagram
            </label>
            <input
              type="url"
              value={formData.instagram_url}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              placeholder="https://instagram.com/sdn1trusmiwetan"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              URL Profil TikTok
            </label>
            <input
              type="url"
              value={formData.tiktok_url}
              onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
              placeholder="https://tiktok.com/@sdn1trusmiwetan"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Kontak</span>
          </button>
        </div>
      </form>
    </div>
  );
}
