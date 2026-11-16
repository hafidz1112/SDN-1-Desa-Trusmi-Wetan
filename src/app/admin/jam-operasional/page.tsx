'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface OperatingHour {
  id: number;
  hari: string;
  jam_buka: string | null;
  jam_tutup: string | null;
  is_libur: number;
}

export default function AdminJamOperasionalPage() {
  const [hours, setHours] = useState<OperatingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings?type=operating_hours')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setHours(data.data.operating_hours || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Validate closing time > opening time if not libur
    for (const h of hours) {
      if (!h.is_libur && h.jam_buka && h.jam_tutup) {
        if (h.jam_tutup <= h.jam_buka) {
          setFeedback({
            type: 'error',
            message: `Jam tutup hari ${h.hari} (${h.jam_tutup}) harus lebih lambat dari jam buka (${h.jam_buka}).`,
          });
          return;
        }
      }
    }

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'operating_hours', data: hours }),
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
          <Clock className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Data Tunggal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Jam Operasional Sekolah</h1>
        <p className="text-sm text-slate-500 mt-1">
          Atur jadwal buka, tutup, dan hari libur sekolah yang akan ditampilkan pada halaman Hubungi Kami dan footer.
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="divide-y divide-slate-100">
          {hours.map((item, idx) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="w-32 font-semibold text-sm text-slate-900">
                {item.hari}
              </div>

              <div className="flex flex-wrap items-center gap-4 flex-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.is_libur === 1}
                    onChange={(e) => handleChange(idx, 'is_libur', e.target.checked ? 1 : 0)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Libur</span>
                </label>

                {item.is_libur === 0 ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={item.jam_buka || ''}
                      onChange={(e) => handleChange(idx, 'jam_buka', e.target.value)}
                      required
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-slate-400 text-xs">sampai</span>
                    <input
                      type="time"
                      value={item.jam_tutup || ''}
                      onChange={(e) => handleChange(idx, 'jam_tutup', e.target.value)}
                      required
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-xs text-slate-500">WIB</span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    Tutup / Libur Operasional
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Jam Operasional</span>
          </button>
        </div>
      </form>
    </div>
  );
}
