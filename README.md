# Website Profil & Portal Informasi SDN 1 Trusmi Wetan

Portal website resmi dan sistem manajemen konten (CMS) untuk **SD Negeri 1 Trusmi Wetan**, Kecamatan Plered, Kabupaten Cirebon, Jawa Barat. Aplikasi ini dibangun berdasarkan spesifikasi dokumen PRD (*Product Requirements Document*) dan SRS (*Software Requirements Specification*).

---

## Data Pokok Kelembagaan

| Parameter | Data Resmi |
|---|---|
| **Nama Sekolah** | SDN 1 Trusmi Wetan |
| **NPSN** | 20215577 |
| **Bentuk Pendidikan** | Sekolah Dasar (SD) |
| **Status Sekolah** | Negeri |
| **Peringkat Akreditasi** | A (BAN-S/M Kemdikbud) |
| **Kepala Sekolah** | Hj. Marpuah, S.Pd. |
| **Alamat** | Desa Trusmi Wetan, Kec. Plered, Kab. Cirebon, Jawa Barat 45154 |
| **Email Resmi** | sdn1trusmiwetan@gmail.com |
| **Hari & Jam Kerja** | Senin - Sabtu: 07.00 - 12.10 WIB |

---

## Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Server Components & Dynamic Rendering)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) & React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Database**: [Turso](https://turso.tech/) (Cloud LibSQL / SQLite Serverless)
- **Kompresi Media**: [Sharp](https://sharp.pixelplumbing.com/) (Otomatis konversi foto ke WebP 80% kualitas, maksimal 1600px)
- **Keamanan & Autentikasi**: [Jose](https://github.com/panva/jose) (JWT Session berbasis HttpOnly Cookie) & [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Package Manager**: pnpm

---

## Fitur Aplikasi

### 1. Website Publik (Halaman Pengunjung)

- **Beranda (`/`)**:
  - *Hero Carousel Slider* interaktif dengan kendali panah dan titik navigasi aktif.
  - Bilah 4 pilar fitur sekolah (*Ruang Kelas Nyaman, Guru Berdedikasi, Ramah Anak, Pendidikan Holistik*).
  - Seksi sambutan pimpinan beserta 4 metrik sekolah (Akreditasi A, 12 Rombel, 20+ Juara, Komitmen Karakter).
  - Etalase akademik kurikulum merdeka dan pembiasaan religius.
  - Galeri fasilitas dan sarana prasarana sekolah.
  - Daftar aktivitas rutin dan etalase kejuaraan siswa.
  - Banner informasi pendaftaran SPMB 2026/2027.
  - Berita dan warta terbaru sekolah.
- **Profil Lembaga (`/profil`)**: Sambutan kepala sekolah, foto pimpinan, sejarah sekolah, visi, misi, dan tujuan pendidikan.
- **Identitas & Akreditasi (`/identitas`)**: Data pokok kelembagaan lengkap dan tautan petunjuk arah Google Maps.
- **Akademik**:
  - **Rombel & Dewan Guru (`/kelas-guru`)**: 12 rombel belajar (Kelas 1 s.d. 6) beserta wali kelas dan daftar seluruh tenaga pendidik.
  - **Ekstrakurikuler (`/ekstrakurikuler`)**: Informasi kegiatan bakat, minat, jadwal latihan, dan nama pembina.
  - **Sarana & Prasarana (`/sarana-prasarana`)**: Inventaris ruang kelas, laboratorium, perpustakaan, lapangan, dan UKS.
- **Kegiatan Sekolah (`/kegiatan` & `/kegiatan/[slug]`)**: Agenda kegiatan sekolah dengan filter kegiatan rutin vs khusus.
- **Prestasi Siswa (`/prestasi` & `/prestasi/[id]`)**: Etalase kejuaraan siswa dengan filter tingkat kecamatan, kabupaten, dan provinsi.
- **Warta & Berita (`/berita` & `/berita/[slug]`)**: Artikel warta resmi sekolah dengan fitur paginasi dan pembacaan detail.
- **Galeri Dokumentasi (`/galeri`)**: Dokumentasi foto kegiatan belajar dan upacara dengan filter album.
- **Portal SPMB (`/spmb`)**: Status pendaftaran (Buka/Tutup), berkas persyaratan, jadwal tahapan, unduh pamflet, informasi bantuan PIP/KIP, dan lokasi sekolah.
- **Hubungi Kami (`/hubungi-kami`)**: Kanal kontak resmi via WhatsApp, surel kantor, jam operasional harian, dan denah sekolah.

### 2. Panel Pengelolaan Super Admin (`/admin`)

- **Keamanan Login**:
  - Pembatasan upaya login: maksimal 5 kali gagal sebelum akun terkunci selama 15 menit (*rate-limiting & lock*).
  - Sesi otomatis kadaluarsa dalam 30 menit.
- **Pengelolaan Data Tunggal**:
  - Identitas sekolah
  - Jam operasional harian
  - Profil lembaga, sambutan, visi, dan misi
  - Pengaturan teks dan foto hero beranda
  - Kontak dan nomor pelayanan publik
  - Status dan jadwal penerimaan murid baru (SPMB)
- **Pengelolaan Koleksi Data (CRUD Lengkap)**:
  - Berita dan pengumuman
  - Prestasi siswa
  - Agenda kegiatan
  - Album dan foto galeri
  - Persyaratan SPMB dan jadwal seleksi
  - Brosur pamflet SPMB
  - Tenaga pendidik (GTK) dan rombel kelas
  - Sarana prasarana dan ekstrakurikuler
- **Penyimpanan Media Mandiri**:
  - Foto dikompresi otomatis ke format WebP.
  - Disimpan langsung ke cloud database Turso melalui rute `/api/media/[id]`.
  - Berkas tidak akan hilang saat redeploy serverless (Vercel).
- **Catatan Aktivitas (*Audit Logs*)**: Rekaman riwayat perubahan data oleh administrator.

---

## Kredensial Administrator Bawaan

Akses portal admin tersedia melalui menu navigasi atas atau langsung ke rute `/admin/login`:

- **URL Login**: `/admin/login`
- **Nama Pengguna**: `admin`
- **Kata Sandi**: `AdminTrusmi123!`
- **Nama Akun**: Pak Niko Rindi Mulyana

> Anda dapat mengganti kata sandi setelah masuk ke dashboard melalui menu **Ubah Kata Sandi**.

---

## Struktur Direktori Proyek

```text
sdn-1-trusmi-wetan/
├── public/                 # Berkas statis (logo, favicon, placeholder)
├── src/
│   ├── app/                # Rute Next.js App Router
│   │   ├── (public pages)  # Beranda, profil, identitas, akademik, spmb, dll.
│   │   ├── admin/          # Panel dashboard super admin
│   │   └── api/            # API Route handlers (auth, upload, media, settings)
│   ├── components/         # Komponen UI (Header, Footer, HeroSlider, ImageWithFallback)
│   └── lib/                # Konfigurasi database Turso, otentikasi JWT, audit log
├── .env.example            # Template variabel lingkungan
├── .env.local              # Konfigurasi lokal (diabaikan git)
├── next.config.ts          # Konfigurasi Next.js
├── package.json            # Daftar dependensi modul
└── tsconfig.json           # Konfigurasi TypeScript
```

---

## Panduan Instalasi Lokal

### 1. Kloning Repositori

```bash
git clone https://github.com/hafidz1112/sdn-1-trusmi-wetan.git
cd sdn-1-trusmi-wetan
```

### 2. Pasang Dependensi

```bash
pnpm install
```

### 3. Buat File Konfigurasi Lingkungan (`.env.local`)

Salin template konfigurasi:

```bash
cp .env.example .env.local
```

Isi `.env.local` dengan kredensial database Turso Anda:

```env
DATABASE_URL="libsql://sdn1-trusmi-wetan-physics.aws-ap-southeast-1.turso.io"
DATABASE_AUTH_TOKEN="your_turso_auth_token"
JWT_SECRET="sdn1_trusmi_wetan_jwt_secret_key_2026"
```

### 4. Jalankan Server Pengembangan

```bash
pnpm run dev
```

Buka peramban Anda di `http://localhost:3000`.

### 5. Kompilasi Build Produksi

```bash
pnpm run build
```

---

## Panduan Deployment ke Vercel

1. Hubungkan repositori GitHub Anda ke **Vercel**.
2. Pada pengaturan proyek di Vercel (**Project Settings > Environment Variables**), tambahkan 3 variabel berikut:
   - `DATABASE_URL`: URL database Turso Anda (`libsql://...`)
   - `DATABASE_AUTH_TOKEN`: Token autentikasi database Turso
   - `JWT_SECRET`: Kunci rahasia sesi admin
3. Centang seluruh target lingkungan (**Production**, **Preview**, **Development**), lalu klik **Save**.
4. Jalankan proses **Deploy** / **Redeploy**. Aplikasi akan otomatis online dan terhubung ke cloud database secara *real-time*.

---

## Lisensi

Proyek ini dikembangkan khusus untuk **SD Negeri 1 Trusmi Wetan**, Kabupaten Cirebon. Seluruh materi identitas dan konten sekolah dilindungi oleh hak cipta sekolah terkait.
