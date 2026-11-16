'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Nama pengguna dan kata sandi wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.isLocked) {
          setIsLocked(true);
        }
        setErrorMsg(data.message || 'Nama pengguna atau kata sandi salah.');
        setLoading(false);
        return;
      }

      // Successful login
      router.push('/admin');
    } catch {
      setErrorMsg('Gagal terhubung ke server');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
        {/* Header with School Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image
              src="/images/logo.svg"
              alt="Logo SDN 1 Trusmi Wetan"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Masuk Super Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dashboard Pengelolaan Informasi SDN 1 Trusmi Wetan
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
              isLocked
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{isLocked ? 'Akun Terkunci Sementara' : 'Gagal Masuk'}</span>
              <p className="mt-0.5 text-xs">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Pengguna
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked || loading}
                placeholder="Masukkan nama pengguna"
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || loading}
                placeholder="Masukkan kata sandi"
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked || loading}
            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Website Publik
          </Link>
          <span className="text-[11px] text-slate-400">SDN 1 Trusmi Wetan</span>
        </div>
      </div>
    </div>
  );
}
