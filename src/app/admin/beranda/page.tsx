'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Plus,
  Trash2,
  Layers,
  GraduationCap,
  Image as ImageIcon,
} from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface SlideFormItem {
  id?: number;
  badge: string;
  title: string;
  subtitle: string;
  primary_btn_text: string;
  primary_btn_href: string;
  secondary_btn_text: string;
  secondary_btn_href: string;
  media_id: number | null;
  bg_image: string;
}

export default function AdminBerandaPage() {
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_media_id: null as number | null,
    hero_media_url: '',
    intro_text: '',
    stat_siswa: 312,
    stat_guru: 16,
    stat_rombel: 12,
    stat_prestasi: 20,
    academic_badge: 'AKADEMIK & KEUNGGULAN',
    academic_title: 'Belajar, Berkembang, Berprestasi.',
    academic_media_id: null as number | null,
    academic_media_url: '',
    academic_card_title: 'Pendidikan Karakter Holistik',
    academic_card_subtitle: 'Religi • Prestasi • Budi Pekerti',
  });

  const [slides, setSlides] = useState<SlideFormItem[]>([
    {
      badge: 'Sekolah Dasar Negeri Unggulan & Berkarakter',
      title: 'Membentuk Generasi Cerdas, Berkarakter & Berprestasi',
      subtitle:
        'Di SDN 1 Trusmi Wetan, kami membina generasi muda yang berakhlak mulia, cerdas, berprestasi, dan berwawasan lingkungan melalui kurikulum yang menginspirasi.',
      primary_btn_text: 'PENDAFTARAN SPMB',
      primary_btn_href: '/spmb',
      secondary_btn_text: 'JELAJAHI PROFIL',
      secondary_btn_href: '/profil',
      media_id: null,
      bg_image: '',
    },
  ]);

  const [academicFeatures, setAcademicFeatures] = useState([
    {
      title: 'Kurikulum Merdeka',
      desc: 'Pembelajaran berdiferensiasi dan berbasis proyek (P5) yang berpusat pada minat serta potensi unik peserta didik.',
    },
    {
      title: 'Guru Berpengalaman',
      desc: 'Tenaga pendidik berkompeten dan berdedikasi membimbing perkembangan intelektual serta akhlak murid.',
    },
    {
      title: 'Pembiasaan Religius',
      desc: 'Pelaksanaan rutin salat Duha, tadarus Al-Qur’an, dan penanaman budi pekerti setiap hari di sekolah.',
    },
    {
      title: 'Prestasi Terarah',
      desc: 'Pembinaan intensif olimpiade akademik, kejuaraan olahraga karate & tenis meja, serta seni kreasi siswa.',
    },
  ]);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAcademic, setUploadingAcademic] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const academicFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings?type=beranda')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (data.data.beranda) {
            const b = data.data.beranda;
            setFormData({
              hero_title: b.hero_title || '',
              hero_subtitle: b.hero_subtitle || '',
              hero_media_id: b.hero_media_id || null,
              hero_media_url: b.hero_media_url || '',
              intro_text: b.intro_text || '',
              stat_siswa: b.stat_siswa ?? 312,
              stat_guru: b.stat_guru ?? 16,
              stat_rombel: b.stat_rombel ?? 12,
              stat_prestasi: b.stat_prestasi ?? 20,
              academic_badge: b.academic_badge || 'AKADEMIK & KEUNGGULAN',
              academic_title: b.academic_title || 'Belajar, Berkembang, Berprestasi.',
              academic_media_id: b.academic_media_id || null,
              academic_media_url: b.academic_media_url || '',
              academic_card_title: b.academic_card_title || 'Pendidikan Karakter Holistik',
              academic_card_subtitle: b.academic_card_subtitle || 'Religi • Prestasi • Budi Pekerti',
            });

            if (b.academic_features) {
              try {
                const parsed =
                  typeof b.academic_features === 'string'
                    ? JSON.parse(b.academic_features)
                    : b.academic_features;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setAcademicFeatures(parsed);
                }
              } catch {}
            }
          }

          if (Array.isArray(data.data.hero_slides) && data.data.hero_slides.length > 0) {
            setSlides(
              data.data.hero_slides.map((s: any) => ({
                id: s.id,
                badge: s.badge || '',
                title: s.title || '',
                subtitle: s.subtitle || '',
                primary_btn_text: s.primary_btn_text || 'PENDAFTARAN SPMB',
                primary_btn_href: s.primary_btn_href || '/spmb',
                secondary_btn_text: s.secondary_btn_text || 'JELAJAHI PROFIL',
                secondary_btn_href: s.secondary_btn_href || '/profil',
                media_id: s.media_id || null,
                bg_image: s.bg_image || '',
              }))
            );
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleActiveSlideChange = <K extends keyof SlideFormItem>(key: K, value: SlideFormItem[K]) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[activeSlideIndex] = {
        ...updated[activeSlideIndex],
        [key]: value,
      };
      return updated;
    });
  };

  const handleSlideFileUpload = async (file: File) => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSlides((prev) => {
          const updated = [...prev];
          updated[activeSlideIndex] = {
            ...updated[activeSlideIndex],
            media_id: data.data.id,
            bg_image: data.data.file_path,
          };
          return updated;
        });
      } else {
        alert(data.message || 'Gagal mengunggah gambar');
      }
    } catch {
      alert('Gagal mengunggah berkas');
    } finally {
      setUploading(false);
    }
  };

  const handleAcademicFileUpload = async (file: File) => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    setUploadingAcademic(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev) => ({
          ...prev,
          academic_media_id: data.data.id,
          academic_media_url: data.data.file_path,
        }));
      } else {
        alert(data.message || 'Gagal mengunggah gambar');
      }
    } catch {
      alert('Gagal mengunggah berkas');
    } finally {
      setUploadingAcademic(false);
    }
  };

  const handleAddSlide = () => {
    const newSlide: SlideFormItem = {
      badge: `Slide Baru ke-${slides.length + 1}`,
      title: 'Judul Slide Hero Baru',
      subtitle: 'Deskripsi dan penjelasan ringkas slide hero sekolah.',
      primary_btn_text: 'PENDAFTARAN SPMB',
      primary_btn_href: '/spmb',
      secondary_btn_text: 'JELAJAHI PROFIL',
      secondary_btn_href: '/profil',
      media_id: null,
      bg_image: '',
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    if (slides.length <= 1) {
      alert('Minimal harus memiliki 1 slide');
      return;
    }
    if (!confirm(`Hapus Slide ${indexToDelete + 1}?`)) {
      return;
    }

    setSlides((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    if (activeSlideIndex >= slides.length - 1) {
      setActiveSlideIndex(Math.max(0, slides.length - 2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);

    // Sync first slide to legacy settings
    const firstSlide = slides[0];
    const payloadData = {
      ...formData,
      hero_title: firstSlide ? firstSlide.title : formData.hero_title,
      hero_subtitle: firstSlide ? firstSlide.subtitle : formData.hero_subtitle,
      hero_media_id: firstSlide ? firstSlide.media_id : formData.hero_media_id,
      slides: slides,
      academic_features: academicFeatures,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'beranda', data: payloadData }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: 'success', message: 'Pengaturan beranda dan seluruh konten berhasil disimpan.' });
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

  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Home className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Data Tunggal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Halaman Beranda</h1>
        <p className="text-sm text-slate-500 mt-1">
          Atur carousel slide banner utama (hero), bagian akademik &amp; keunggulan, kutipan pembuka, serta angka statistik ringkas yang tampil di Beranda publik.
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
        {/* Banner Hero Slides Manager */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Carousel Banner Utama (Hero Slider)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap slide dapat memiliki gambar latar belakang, badge, judul, dan tombol yang berbeda-beda.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Slide</span>
            </button>
          </div>

          {/* Slide Tab Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeSlideIndex === idx
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Slide {idx + 1}</span>
                {s.bg_image ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Memiliki gambar latar" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" title="Tanpa gambar latar" />
                )}
              </button>
            ))}
          </div>

          {/* Current Slide Form Card */}
          {currentSlide && (
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mengedit Slide {activeSlideIndex + 1} dari {slides.length}
                </span>
                {slides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(activeSlideIndex)}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Slide Ini</span>
                  </button>
                )}
              </div>

              {/* Background Image per slide */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Gambar Latar Slide {activeSlideIndex + 1}{' '}
                  <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <div className="relative w-full h-56 bg-slate-200/80 rounded-xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                  {currentSlide.bg_image ? (
                    <>
                      <ImageWithFallback
                        src={currentSlide.bg_image}
                        alt={`Slide ${activeSlideIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleActiveSlideChange('media_id', null);
                          handleActiveSlideChange('bg_image', '');
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                        title="Hapus gambar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                      <span className="text-xs">Belum ada gambar latar untuk slide ini</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={slideFileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSlideFileUpload(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => slideFileInputRef.current?.click()}
                  disabled={uploading}
                  className="py-2 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>
                    {currentSlide.bg_image
                      ? `Ganti Gambar Slide ${activeSlideIndex + 1}`
                      : `Unggah Gambar Slide ${activeSlideIndex + 1}`}
                  </span>
                </button>
              </div>

              {/* Slide Content Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Badge / Label Mini di Atas Judul
                  </label>
                  <input
                    type="text"
                    value={currentSlide.badge}
                    onChange={(e) => handleActiveSlideChange('badge', e.target.value)}
                    placeholder="Contoh: Sekolah Dasar Negeri Unggulan & Berkarakter"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Slide <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentSlide.title}
                    onChange={(e) => handleActiveSlideChange('title', e.target.value)}
                    placeholder="Contoh: Membentuk Generasi Berkarakter, Cerdas, dan Berbudaya"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subjudul / Deskripsi Slide
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlide.subtitle}
                    onChange={(e) => handleActiveSlideChange('subtitle', e.target.value)}
                    placeholder="Contoh: Selamat Datang di Website Resmi SDN 1 Trusmi Wetan..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Primary & Secondary Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                      Tombol Utama (Kuning)
                    </span>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Teks Tombol</label>
                      <input
                        type="text"
                        value={currentSlide.primary_btn_text}
                        onChange={(e) => handleActiveSlideChange('primary_btn_text', e.target.value)}
                        placeholder="Contoh: PENDAFTARAN SPMB"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Link URL Tombol</label>
                      <input
                        type="text"
                        value={currentSlide.primary_btn_href}
                        onChange={(e) => handleActiveSlideChange('primary_btn_href', e.target.value)}
                        placeholder="Contoh: /spmb"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      Tombol Kedua (Border Putih)
                    </span>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Teks Tombol</label>
                      <input
                        type="text"
                        value={currentSlide.secondary_btn_text}
                        onChange={(e) => handleActiveSlideChange('secondary_btn_text', e.target.value)}
                        placeholder="Contoh: JELAJAHI PROFIL"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Link URL Tombol</label>
                      <input
                        type="text"
                        value={currentSlide.secondary_btn_href}
                        onChange={(e) => handleActiveSlideChange('secondary_btn_href', e.target.value)}
                        placeholder="Contoh: /profil"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bagian Akademik & Keunggulan */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>Bagian Akademik &amp; Keunggulan (Pendidikan Holistik)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur teks keunggulan, 4 pilar kartu akademik, serta foto dan badge kartu samping di halaman Beranda.
            </p>
          </div>

          {/* Judul & Badge Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Badge Section
              </label>
              <input
                type="text"
                value={formData.academic_badge}
                onChange={(e) => setFormData({ ...formData, academic_badge: e.target.value })}
                placeholder="Contoh: AKADEMIK & KEUNGGULAN"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Judul Utama Section
              </label>
              <input
                type="text"
                value={formData.academic_title}
                onChange={(e) => setFormData({ ...formData, academic_title: e.target.value })}
                placeholder="Contoh: Belajar, Berkembang, Berprestasi."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Kartu Foto Vertikal Sisi Kanan */}
          <div className="p-5 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Foto &amp; Badge Kartu Sisi Kanan
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Foto Siswa / Kegiatan Samping <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative w-full max-w-sm h-64 bg-slate-200/80 rounded-xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                {formData.academic_media_url ? (
                  <>
                    <ImageWithFallback
                      src={formData.academic_media_url}
                      alt="Foto Akademik"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, academic_media_id: null, academic_media_url: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                      title="Hapus gambar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                    <span className="text-xs">Belum ada foto khusus (menggunakan placeholder)</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={academicFileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAcademicFileUpload(e.target.files[0]);
                    e.target.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => academicFileInputRef.current?.click()}
                disabled={uploadingAcademic}
                className="py-2 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {uploadingAcademic ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{formData.academic_media_url ? 'Ganti Foto Samping' : 'Unggah Foto Samping'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Badge di Bawah Foto
                </label>
                <input
                  type="text"
                  value={formData.academic_card_title}
                  onChange={(e) => setFormData({ ...formData, academic_card_title: e.target.value })}
                  placeholder="Contoh: Pendidikan Karakter Holistik"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjudul Badge di Bawah Foto
                </label>
                <input
                  type="text"
                  value={formData.academic_card_subtitle}
                  onChange={(e) => setFormData({ ...formData, academic_card_subtitle: e.target.value })}
                  placeholder="Contoh: Religi • Prestasi • Budi Pekerti"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 4 Kartu Keunggulan */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              4 Kartu Keunggulan Akademik
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {academicFeatures.map((feat, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                    Pilar Keunggulan #{idx + 1}
                  </span>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Judul Kartu</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const updated = [...academicFeatures];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setAcademicFeatures(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Deskripsi Singkat</label>
                    <textarea
                      rows={2}
                      value={feat.desc}
                      onChange={(e) => {
                        const updated = [...academicFeatures];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setAcademicFeatures(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intro Text */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Ringkasan Profil Pembuka
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Teks Pengantar di Beranda
            </label>
            <textarea
              rows={4}
              value={formData.intro_text}
              onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
              placeholder="Teks singkat yang merangkum keunggulan dan semangat sekolah..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Manual Stats */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Statistik Ringkas Beranda
          </h2>
          <p className="text-xs text-slate-500">
            Hanya angka yang diisi yang akan ditampilkan pada pita statistik beranda (FR-PUB-014).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Siswa
              </label>
              <input
                type="number"
                value={formData.stat_siswa || ''}
                onChange={(e) => setFormData({ ...formData, stat_siswa: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Guru &amp; Staf
              </label>
              <input
                type="number"
                value={formData.stat_guru || ''}
                onChange={(e) => setFormData({ ...formData, stat_guru: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Rombel
              </label>
              <input
                type="number"
                value={formData.stat_rombel || ''}
                onChange={(e) => setFormData({ ...formData, stat_rombel: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Prestasi
              </label>
              <input
                type="number"
                value={formData.stat_prestasi || ''}
                onChange={(e) => setFormData({ ...formData, stat_prestasi: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Pengaturan Beranda</span>
          </button>
        </div>
      </form>
    </div>
  );
}
