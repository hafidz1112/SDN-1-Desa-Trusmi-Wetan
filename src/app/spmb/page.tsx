import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  HelpCircle,
  Clock,
  MapPin,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getSpmbData() {
  const [settings, requirements, schedules, brochures, contact, identity] = await Promise.all([
    queryOne('SELECT * FROM spmb_settings LIMIT 1'),
    query(`
      SELECT * FROM spmb_requirements 
      WHERE status = 'terbit' 
      ORDER BY urutan ASC, id ASC
    `),
    query(`
      SELECT * FROM spmb_schedules 
      WHERE status = 'terbit' 
      ORDER BY tanggal_mulai ASC
    `),
    query(`
      SELECT b.*, m.file_path, m.original_name, m.size_bytes as file_size
      FROM brochures b
      JOIN media m ON b.media_id = m.id
      WHERE b.status = 'terbit'
      ORDER BY b.tahun DESC, b.id DESC
    `),
    queryOne('SELECT * FROM contact_info LIMIT 1'),
    queryOne('SELECT * FROM school_identity LIMIT 1'),
  ]);

  return {
    settings: settings || {
      status_pendaftaran: 'ditutup',
      teks_pengantar: 'Informasi Penerimaan Murid Baru (SPMB) SDN 1 Trusmi Wetan.',
      info_pip_kip: 'SDN 1 Trusmi Wetan memfasilitasi pengajuan bantuan PIP/KIP bagi siswa kurang mampu.'
    },
    requirements,
    schedules,
    brochures,
    contact: contact || {},
    identity: identity || {},
  };
}

export default async function SpmbPage() {
  const { settings, requirements, schedules, brochures, contact, identity } = await getSpmbData();
  const isOpen = settings.status_pendaftaran === 'dibuka';

  return (
    <div className="py-8 sm:py-16 space-y-8 sm:space-y-12">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0f3b7a] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none">
            <GraduationCap className="w-96 h-96" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20">
              <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Status SPMB: {isOpen ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight leading-tight">
              Sistem Penerimaan Murid Baru (SPMB)
            </h1>

            <p className="text-blue-100/90 text-xs sm:text-base leading-relaxed">
              {settings.teks_pengantar ||
                'Selamat datang di portal informasi resmi penerimaan peserta didik baru SDN 1 Trusmi Wetan. Seluruh proses pendaftaran tidak dipungut biaya (gratis).'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-5 py-3 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi Panitia via WhatsApp</span>
                </a>
              )}
              <Link
                href="/hubungi-kami"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-xs transition-all uppercase tracking-wider text-center"
              >
                <Clock className="w-4 h-4" />
                <span>Lihat Jam Pelayanan</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Jadwal Pelaksanaan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Jadwal Pelaksanaan SPMB</h2>
                <p className="text-xs text-slate-500">Tahapan dan rentang waktu pendaftaran serta daftar ulang</p>
              </div>
            </div>

            {schedules.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Jadwal resmi belum diumumkan.</p>
            ) : (
              <div className="space-y-4">
                {schedules.map((sch: any, idx: number) => {
                  const labelTahap =
                    sch.tahap === 'pendaftaran'
                      ? 'Tahap Pendaftaran Berkas'
                      : sch.tahap === 'daftar_ulang'
                      ? 'Tahap Daftar Ulang'
                      : sch.tahap;

                  return (
                    <div
                      key={sch.id}
                      className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                          {labelTahap}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {sch.tanggal_mulai}
                          {sch.tanggal_selesai ? ` s.d. ${sch.tanggal_selesai}` : ''}
                        </span>
                      </div>
                      {sch.keterangan && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                          {sch.keterangan}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Persyaratan Dokumen */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Persyaratan Dokumen</h2>
                <p className="text-xs text-slate-500">Berkas yang harus disiapkan dan diserahkan ke panitia</p>
              </div>
            </div>

            {requirements.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Persyaratan belum ditentukan.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requirements.map((req: any, idx: number) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3.5"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {req.nama_dokumen}
                      </h4>
                      {req.keterangan && (
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {req.keterangan}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informasi Bantuan PIP / KIP (FR-PUB-037) */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-amber-950">
                  Layanan Bantuan Siswa (PIP / KIP / PKH)
                </h3>
                <p className="text-xs text-amber-800">
                  Komitmen pendidikan merata dan berkeadilan bagi seluruh anak bangsa
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              {settings.info_pip_kip ||
                'SDN 1 Trusmi Wetan proaktif memfasilitasi pendaftaran serta pengusulan Program Indonesia Pintar (PIP) bagi peserta didik dari keluarga pemegang KIP, PKH, atau Surat Keterangan Tidak Mampu (SKTM). Tidak ada biaya apa pun dalam pengajuan ini.'}
            </p>
            <div className="bg-white/70 rounded-xl p-3 border border-amber-200/60 text-xs text-amber-900">
              <span className="font-bold">Tips:</span> Serahkan fotokopi kartu bansos (KIP/PKH/KKS) bersamaan dengan berkas pendaftaran calon murid baru ke meja panitia.
            </div>
          </div>
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Unduh Pamflet / Brosur (FR-PUB-038) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Download className="w-5 h-5 text-blue-700" />
              <span>Unduh Pamflet SPMB</span>
            </div>

            {brochures.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">Brosur resmi digital belum diunggah.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {brochures.map((br: any) => (
                  <a
                    key={br.id}
                    href={br.file_path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {br.judul}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Tahun {br.tahun} • {br.file_size ? `${Math.round(br.file_size / 1024)} KB` : 'Dokumen'}
                      </p>
                    </div>
                    <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-700 group-hover:text-white text-slate-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Informasi Lokasi Sekolah */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              <span>Lokasi Sekolah</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  Ruang Pelayanan Informasi, {identity.nama_sekolah || 'SDN 1 Trusmi Wetan'}
                  <br />
                  {identity.alamat_jalan || 'Desa Trusmi Wetan, Kec. Plered, Kab. Cirebon, Jawa Barat 45154'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Senin - Jumat: 08.00 - 12.00 WIB</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Kepala Sekolah: Hj. Marpuah, S.Pd.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/hubungi-kami"
                className="block text-center w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Halaman Kontak Lengkap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
