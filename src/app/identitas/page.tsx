import React from 'react';
import { Building2, Award, ShieldCheck, MapPin, ExternalLink, Hash } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getIdentityData() {
  return await queryOne(`
    SELECT s.*, m.file_path as logo_url
    FROM school_identity s
    LEFT JOIN media m ON s.logo_media_id = m.id
    LIMIT 1
  `);
}

export default async function IdentitasPage() {
  const identity = await getIdentityData();

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-0.5 w-6 bg-amber-500 inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#1d4ed8] uppercase">
              DATA KELEMBAGAAN
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-serif text-[#0f3b7a] tracking-tight">
            Identitas &amp; Akreditasi Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Data pokok kelembagaan resmi SDN 1 Trusmi Wetan berdasarkan penetapan Kementerian Pendidikan dan Kebudayaan.
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="p-4 sm:p-6 md:p-8 flex items-start gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 shadow-xs p-1.5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <ImageWithFallback
                src={identity?.logo_url || '/images/logo.svg'}
                fallbackSrc="/images/logo.svg"
                alt={identity?.nama_sekolah || 'Logo Sekolah'}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Nama Resmi Sekolah
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 block truncate sm:overflow-visible">
                {identity?.nama_sekolah || 'SDN 1 Trusmi Wetan'}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
