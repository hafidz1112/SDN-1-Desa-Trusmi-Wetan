import React from 'react';
import { Building2, Award, ShieldCheck, MapPin, ExternalLink, Hash } from 'lucide-react';
import { queryOne } from '@/lib/db';

async function getIdentityData() {
  return await queryOne('SELECT * FROM school_identity LIMIT 1');
}

export default async function IdentitasPage() {
  const identity = await getIdentityData();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            Data Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Identitas &amp; Akreditasi Sekolah
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Data pokok kelembagaan resmi SDN 1 Trusmi Wetan berdasarkan penetapan Kementerian Pendidikan dan Kebudayaan.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="p-6 sm:p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Nama Resmi Sekolah
              </span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {identity?.nama_sekolah || 'SDN 1 Trusmi Wetan'}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                NPSN
              </span>
              <span className="text-base font-bold text-slate-800 mt-1 block font-mono">
                {identity?.npsn || 'Informasi belum tersedia'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Status Sekolah
              </span>
              <span className="text-base font-bold text-slate-800 mt-1 block">
                {identity?.status_sekolah || 'Informasi belum tersedia'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Peringkat Akreditasi
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  {identity?.akreditasi ? `Akreditasi ${identity.akreditasi}` : 'Informasi belum tersedia'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Alamat Lengkap
              </span>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {identity?.alamat || 'Desa Trusmi Wetan, Kec. Plered, Kabupaten Cirebon, Jawa Barat 45154'}
              </p>
              {identity?.maps_url && (
                <div className="pt-2">
                  <a
                    href={identity.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                  >
                    <span>Buka Petunjuk Arah di Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
