import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageCircle,
  Video,
  Info,
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getContactData() {
  const [contact, hours, identity] = await Promise.all([
    queryOne('SELECT * FROM contact_info LIMIT 1'),
    query('SELECT * FROM operating_hours ORDER BY id ASC'),
    queryOne('SELECT * FROM school_identity LIMIT 1'),
  ]);

  return {
    contact: contact || {},
    hours: hours || [],
    identity: identity || {},
  };
}

export default async function HubungiKamiPage() {
  const { contact, hours, identity } = await getContactData();
  const waClean = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-0.5 w-6 bg-amber-500 inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#1d4ed8] uppercase">
              LAYANAN &amp; KOMUNIKASI
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0f3b7a] tracking-tight">
            Hubungi SDN 1 Trusmi Wetan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Pusat layanan informasi resmi, konsultasi pendidikan, dan jadwal operasional kelembagaan sekolah.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Official Channels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* WhatsApp */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">WhatsApp Resmi Sekolah</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Konsultasi seputar informasi SPMB, legalisir, dan administrasi umum.
                </p>
                <p className="text-sm font-extrabold text-slate-800 mt-3 font-mono">
                  {contact.whatsapp || 'Belum diisi'}
                </p>
              </div>

              {contact.whatsapp && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <a
                    href={`https://wa.me/${waClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <span>Kirim Pesan WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Pimpinan / Kepala Sekolah */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Kepala Sekolah</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pimpinan satuan pendidikan SDN 1 Trusmi Wetan.
                </p>
                <p className="text-sm font-extrabold text-slate-900 mt-3">
                  Hj. Marpuah, S.Pd.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Lihat Sambutan Kepala Sekolah</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Email Resmi */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Surat Elektronik (Email)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Korespondensi dinas, pengiriman dokumen resmi, dan pengajuan kerjasama.
                </p>
                <p className="text-sm font-extrabold text-slate-800 mt-3 font-mono break-all">
                  {contact.email_publik || 'Belum diisi'}
                </p>
              </div>

              {contact.email_publik && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <a
                    href={`mailto:${contact.email_publik}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>Kirim Email Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Media Sosial */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Media Sosial Resmi</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ikuti dokumentasi kegiatan terkini siswa dan video kreatif sekolah.
                </p>
                <div className="flex flex-col gap-2 mt-3">
                  {contact.instagram_url && (
                    <a
                      href={contact.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-700 hover:text-pink-600 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 fill-pink-600 shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Instagram Resmi</span>
                    </a>
                  )}
                  {contact.tiktok_url && (
                    <a
                      href={contact.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-2"
                    >
                      <Video className="w-4 h-4 text-slate-800" />
                      <span>TikTok Resmi</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Akun dikelola oleh Tim Media Sekolah</span>
              </div>
            </div>
          </div>

          {/* Location & Embedded Map */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Alamat &amp; Peta Lokasi</h2>
                  <p className="text-xs text-slate-500">Kunjungan langsung ke gedung kampus SDN 1 Trusmi Wetan</p>
                </div>
              </div>

              {identity.peta_lokasi_url && (
                <a
                  href={identity.peta_lokasi_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{identity.nama_sekolah || 'SDN 1 Trusmi Wetan'}</p>
              <p>{identity.alamat_jalan || 'Jl. Trusmi Wetan'}</p>
              <p>
                Desa {identity.desa || 'Trusmi Wetan'}, Kecamatan {identity.kecamatan || 'Plered'}, Kabupaten {identity.kabupaten || 'Cirebon'}, Provinsi Jawa Barat, {identity.kode_pos || '45154'}
              </p>
            </div>

            {/* Interactive Map Iframe */}
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title="Peta Lokasi SDN 1 Trusmi Wetan"
                src="https://maps.google.com/maps?q=SDN%201%20Trusmi%20Wetan%20Plered%20Cirebon&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {identity.peta_lokasi_url && (
              <div className="sm:hidden pt-2">
                <a
                  href={identity.peta_lokasi_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-700 text-white"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Notice Policy (BR-01, BR-03) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Pemberitahuan Komunikasi Terbuka:</span>
              <p>
                Website ini tidak mengoperasikan formulir kontak daring atau kotak pesan publik demi menjaga keamanan privasi dan kecepatan penanganan. Untuk setiap keperluan administrasi siswa, mutasi, legalisir ijazah, atau pendaftaran murid baru, silakan menghubungi kami secara langsung melalui WhatsApp atau datang pada jam kerja operasional sekolah.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Jam Operasional */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Jam Operasional</h3>
                <p className="text-xs text-slate-500">Waktu pelayanan kantor &amp; pembelajaran</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {hours.map((h: any) => (
                <div key={h.id} className="py-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{h.hari}</span>
                  {h.is_libur === 1 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                      Libur
                    </span>
                  ) : (
                    <span className="font-mono text-slate-600 font-medium">
                      {h.jam_buka} - {h.jam_tutup} WIB
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 space-y-1">
              <span className="font-bold block">Catatan Operasional:</span>
              <p className="text-[11px] leading-relaxed text-blue-800">
                Pelayanan tata usaha dan konsultasi tamu sekolah dibuka mengikuti jam kerja di atas. Pada hari libur nasional dan cuti bersama, pelayanan ditutup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
