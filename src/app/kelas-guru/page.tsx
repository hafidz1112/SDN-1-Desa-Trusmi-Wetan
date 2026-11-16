import React from 'react';
import { Layers, Users, BookOpen, GraduationCap } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getClassesAndStaffData() {
  const [classes, staff] = await Promise.all([
    query(`
      SELECT c.*, s.nama as wali_kelas_nama, s.jabatan as wali_kelas_jabatan
      FROM classes c
      LEFT JOIN staff s ON c.wali_kelas_id = s.id
      WHERE c.status = 'terbit'
      ORDER BY c.urutan ASC, c.id ASC
    `),
    query(`
      SELECT s.*, m.file_path as foto_url
      FROM staff s
      LEFT JOIN media m ON s.media_id = m.id
      WHERE s.status = 'terbit'
      ORDER BY s.urutan ASC, s.id ASC
    `),
  ]);

  let totalSiswa = 0;
  for (const c of classes) {
    if (c.jumlah_siswa) {
      totalSiswa += Number(c.jumlah_siswa);
    }
  }

  return {
    classes,
    staff,
    totalSiswa,
  };
}

export default async function KelasDanGuruPage() {
  const { classes, staff, totalSiswa } = await getClassesAndStaffData();

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-0.5 w-6 bg-amber-500 inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#1d4ed8] uppercase">
              AKADEMIK &amp; KESISWAAN
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#0f3b7a] tracking-tight">
            Rombongan Belajar &amp; Dewan Guru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Struktur kelas belajar aktif beserta para pendidik dan tenaga kependidikan berdedikasi SDN 1 Trusmi Wetan.
          </p>
        </div>
      </div>

      {/* Rombel Section (FR-PUB-022 & FR-PUB-023) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Daftar Rombel &amp; Wali Kelas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Sebaran 12 rombongan belajar tingkat kelas 1 hingga 6.
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-blue-700" />
            <div className="text-xs">
              <span className="block text-slate-500">Total Siswa Terhitung:</span>
              <span className="font-extrabold text-blue-800 text-sm">{totalSiswa} Siswa</span>
            </div>
          </div>
        </div>

        {classes.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada data rombel.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-extrabold text-sm flex items-center justify-center">
                    {cls.nama_rombel}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {cls.jumlah_siswa ? `${cls.jumlah_siswa} Siswa` : 'Belum diisi'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Wali Kelas:
                  </span>
                  <span className="text-sm font-semibold text-slate-800 line-clamp-1 mt-0.5">
                    {cls.wali_kelas_nama || 'Belum ditentukan'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dewan Guru & Tenaga Kependidikan (FR-PUB-024) */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
              Pendidik &amp; Tenaga Kependidikan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dewan Guru &amp; Staf Sekolah
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Bekerja dengan ketulusan hati mendidik tunas bangsa berprestasi.
            </p>
          </div>

          {staff.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada data guru.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {staff.map((st) => (
                <div
                  key={st.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow text-center flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <ImageWithFallback
                      src={st.foto_url}
                      alt={st.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">
                        {st.nama}
                      </h3>
                      <p className="text-[11px] text-blue-700 font-semibold mt-1 line-clamp-1">
                        {st.jabatan}
                      </p>
                    </div>
                    {st.mata_pelajaran && (
                      <span className="text-[10px] text-slate-400 mt-2 block border-t border-slate-100 pt-2 line-clamp-1">
                        {st.mata_pelajaran}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
