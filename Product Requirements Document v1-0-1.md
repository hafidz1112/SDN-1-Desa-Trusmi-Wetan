# Product Requirements Document (PRD)

## Website Informasi dan Profil SDN 1 Trusmi Wetan

|Atribut|Keterangan|
|-|-|
|Nama produk|Sistem Informasi Profil Sekolah Berbasis Web, SDN 1 Trusmi Wetan|
|Jenis proyek|Proyek Capstone|
|Versi dokumen|1.1 (Draf)|
|Status|Menunggu verifikasi data dan persetujuan pihak sekolah|
|Dokumen turunan|SRS (disusun setelah PRD disetujui)|
|Referensi tampilan|https://spmb.smkn1-cirebon.sch.id/|
|Target rilis|Desember 2026 (asumsi), mendukung persiapan SPMB Juli 2027|

\---

## 1\. Ringkasan Produk

Website resmi SDN 1 Trusmi Wetan yang berfungsi **semata-mata sebagai media informasi dan profil sekolah**. Produk terdiri dari dua bagian:

1. **Website publik (frontend):** menampilkan profil, prestasi, kegiatan, fasilitas, informasi SPMB, dan kontak sekolah kepada masyarakat.
2. **Dashboard admin (backend):** tempat **satu super admin** mengelola seluruh data yang tampil di website publik.

Website tidak menyediakan pendaftaran daring, akun pengunjung, maupun pengelolaan data siswa.

## 2\. Latar Belakang dan Masalah

|No|Masalah|Dampak|
|-|-|-|
|1|Sekolah belum memiliki website resmi|Tidak ada sumber informasi tepercaya yang dapat diakses kapan saja|
|2|Informasi disampaikan tatap muka dan melalui WhatsApp, Instagram, TikTok tanpa dokumentasi terpusat|Informasi tercecer dan sulit dicari|
|3|Kepala sekolah baru menjabat dan masyarakat belum banyak tertuju ke sekolah|Peminat calon murid rendah|
|4|Muncul anggapan bahwa sekolah ini "buangan", padahal sudah memiliki sekitar 20 prestasi|Citra sekolah tidak sesuai kenyataan|
|5|Calon wali murid sering menanyakan bantuan PIP dan persyaratan pendaftaran|Pertanyaan berulang yang harus dijawab manual|

## 3\. Tujuan Produk

|No|Tujuan|Indikator keberhasilan (usulan)|
|-|-|-|
|1|Menyediakan satu sumber informasi resmi sekolah|Seluruh halaman inti terbit dan dapat diakses publik|
|2|Memperbaiki citra sekolah melalui prestasi dan kegiatan|Prestasi dan kegiatan tampil di halaman utama; konten diperbarui rutin|
|3|Memudahkan calon wali murid memperoleh informasi SPMB|Persyaratan, jadwal, dan pamflet SPMB tersedia sebelum periode pendaftaran|
|4|Memungkinkan sekolah memperbarui informasi secara mandiri|Super admin dapat menambah, mengubah, dan menghapus konten tanpa bantuan developer|

## 4\. Pengguna dan Pemangku Kepentingan

|Peran|Keterangan|Kebutuhan utama|
|-|-|-|
|Pengunjung publik (calon wali murid, orang tua, masyarakat)|Pengguna frontend, tanpa login|Menemukan profil, prestasi, kegiatan, persyaratan dan jadwal SPMB, lokasi|
|**Super admin**|Satu-satunya pengguna dashboard; pihak sekolah yang ditunjuk (Pak Niko Rindi Mulyana)|Mengelola seluruh konten dengan mudah|

Tidak ada peran lain pada sistem (tanpa editor, tanpa multi-admin, tanpa akun pengunjung).

## 5\. Ruang Lingkup

### 5.1 Dalam cakupan

* Website publik responsif berbahasa Indonesia.
* Dashboard dengan satu akun super admin.
* Pengelolaan konten (tambah, lihat, ubah, hapus) untuk seluruh data yang tampil di website publik.
* Unggah dan pengelolaan foto serta dokumen (pamflet).
* Gambar pengganti (placeholder) otomatis apabila foto belum tersedia.

### 5.2 Di luar cakupan

* Pendaftaran SPMB secara daring dan pengelolaan berkas pendaftar.
* Data pribadi siswa dan nilai; sistem hanya menampilkan jumlah siswa per rombel.
* Akun pengunjung, komentar, dan forum.
* Peran pengguna selain super admin.
* Aplikasi seluler asli.
* Sistem pembayaran.

## 6\. Prinsip Produk

1. **Informatif:** hanya menyajikan informasi sekolah yang resmi.
2. **Sederhana bagi admin:** dashboard mudah digunakan oleh staf sekolah yang tidak berlatar teknis.
3. **Seluruh konten dapat diubah:** tidak ada konten publik yang tertanam permanen pada kode.
4. **Ringan dan responsif:** nyaman diakses lewat ponsel pada jaringan seluler.
5. **Privasi:** tidak menampilkan nomor pribadi kepala sekolah maupun data pribadi siswa.
6. **Tidak terhambat kelengkapan data:** sistem tetap dapat dipakai dan ditayangkan meskipun sebagian data atau foto belum tersedia.

## 7\. Fitur Produk

Prioritas: **P0** wajib pada rilis pertama, **P1** penting, **P2** opsional/menyusul.

### 7.1 Website Publik

|ID|Halaman / fitur|Deskripsi|Prioritas|
|-|-|-|-|
|PUB-01|Beranda|Banner identitas sekolah, ringkasan profil, sorotan prestasi, berita dan pengumuman terbaru, kegiatan rutin|P0|
|PUB-02|Profil sekolah|Sambutan kepala sekolah, visi, misi, tujuan, sejarah singkat|P0|
|PUB-03|Identitas dan akreditasi|NPSN, status sekolah, alamat lengkap, peringkat akreditasi|P0|
|PUB-05|Kelas dan guru|Daftar rombel, wali kelas, jumlah siswa|P0|
|PUB-06|Ekstrakurikuler|Daftar kegiatan pengembangan minat dan bakat|P0|
|PUB-07|Sarana dan prasarana|Daftar fasilitas dan foto|P0|
|PUB-08|Kegiatan|Daftar dan detail kegiatan sekolah, termasuk kegiatan rutin|P0|
|PUB-09|Prestasi|Daftar dan detail prestasi siswa dan sekolah|P0|
|PUB-10|Berita dan pengumuman|Daftar dan detail informasi terkini, libur akademik, edaran orang tua|P0|
|PUB-11|Galeri|Kumpulan foto kegiatan dan prestasi|P1|
|PUB-13|Informasi SPMB|Persyaratan, jadwal dan tahapan (pendaftaran dan daftar ulang), pamflet, informasi PIP/KIP|P0|
|PUB-14|Hubungi Kami|Alamat, jam operasional, peta lokasi, tautan media sosial|P0|
|PUB-15|Footer global|Identitas singkat, navigasi, tautan media sosial|P0|

### 7.2 Dashboard Super Admin

|ID|Fitur|Deskripsi|Prioritas|
|-|-|-|-|
|ADM-01|Login dan logout|Autentikasi satu akun super admin|P0|
|ADM-02|Ubah kata sandi|Super admin dapat mengganti kata sandi|P0|
|ADM-03|Ringkasan dashboard|Ringkasan jumlah konten (berita, prestasi, kegiatan, foto) dan pintasan ke modul|P1|
|ADM-04|Pengelolaan konten|Modul pengelolaan data sesuai Bagian 8|P0|
|ADM-05|Pengelolaan media|Unggah foto dan dokumen (bersifat opsional), kompresi otomatis, penggantian dan penghapusan berkas; gambar pengganti tampil otomatis jika foto tidak diunggah|P0|
|ADM-06|Status terbit|Konten dapat disimpan sebagai draf atau diterbitkan|P1|
|ADM-07|Pengaturan urutan tampil|Konten tertentu dapat diurutkan (misi, persyaratan, ekstrakurikuler)|P1|
|ADM-08|Konfirmasi hapus|Dialog konfirmasi sebelum data dihapus|P0|
|ADM-09|Pencarian dan filter|Pencarian pada daftar data|P2|
|ADM-10|Catatan aktivitas|Riwayat perubahan data|P2|

## 8\. Modul Konten yang Dikelola Super Admin

### 8.1 Data tunggal (lihat dan ubah)

|Modul|Isi|
|-|-|
|Identitas sekolah|Nama, NPSN, status, akreditasi, alamat, tautan Google Maps|
|Jam operasional|Jam per hari (Senin–Kamis, Jumat, Sabtu)|
|Sambutan kepala sekolah|Teks dan foto|
|Sejarah singkat|Teks dan foto pendukung|
|Visi dan tujuan|Teks|
|Beranda|Banner, teks pembuka, statistik ringkas|
|Kontak dan media sosial|Kontak publik, tautan Instagram, TikTok, WhatsApp|
|Pengaturan SPMB|Status pendaftaran (dibuka/ditutup), teks pengantar, informasi PIP/KIP|

### 8.2 Koleksi data (tambah, lihat, ubah, hapus)

|Modul|Bidang utama (usulan)|Tahap|
|-|-|-|
|Berita dan pengumuman|Judul, isi, foto, tanggal, status|1|
|Prestasi|Nama prestasi, peraih, tingkat, tahun, foto|1|
|Kegiatan|Judul, deskripsi, tanggal, foto, penanda kegiatan rutin|1|
|Galeri|Foto, keterangan, album|1|
|Persyaratan SPMB|Nama dokumen, keterangan, urutan|1|
|Jadwal SPMB|Tahap (pendaftaran atau daftar ulang), tanggal mulai dan selesai, keterangan|1|
|Pamflet/dokumen|Judul, berkas, tahun|1|
|Misi|Poin misi, urutan|1|
|Ekstrakurikuler|Nama, deskripsi, pembina, jadwal, foto|2|
|Fasilitas|Nama, deskripsi, jumlah, kondisi, foto|2|
|Guru dan tenaga kependidikan|Nama, jabatan, mata pelajaran, foto|2|
|Kelas/rombel|Nama rombel, wali kelas, jumlah siswa|2|

### 8.3 Ketentuan Kolom Wajib dan Opsional (Usulan)

Hanya kolom **wajib** yang harus diisi untuk menyimpan data. Kolom lain bersifat opsional, termasuk seluruh foto.

|Modul|Kolom wajib|Kolom opsional|
|-|-|-|
|Berita dan pengumuman|Judul, isi, tanggal|Foto|
|Prestasi|Nama prestasi|Peraih, tingkat, tahun, foto|
|Kegiatan|Judul|Deskripsi, tanggal, foto, penanda kegiatan rutin|
|Galeri|Foto|Keterangan, album|
|Persyaratan SPMB|Nama dokumen|Keterangan, urutan|
|Jadwal SPMB|Tahap, tanggal mulai|Tanggal selesai, keterangan|
|Pamflet/dokumen|Judul, berkas|Tahun|
|Misi|Poin misi|Urutan|
|Ekstrakurikuler|Nama|Deskripsi, pembina, jadwal, foto|
|Fasilitas|Nama|Deskripsi, jumlah, kondisi, foto|
|Guru dan tenaga kependidikan|Nama, jabatan|Mata pelajaran, foto|
|Kelas/rombel|Nama rombel|Wali kelas, jumlah siswa|
|Data tunggal (Bagian 8.1)|Nama sekolah|Seluruh kolom lainnya, termasuk foto|

## 9\. User Stories

|ID|Sebagai|Saya ingin|Agar|
|-|-|-|-|
|US-01|Calon wali murid|melihat persyaratan dan jadwal SPMB|saya dapat mempersiapkan berkas tanpa datang ke sekolah|
|US-02|Calon wali murid|melihat prestasi dan kegiatan sekolah|saya yakin dengan kualitas sekolah|
|US-04|Masyarakat|melihat alamat, jam operasional, dan peta|saya dapat menemukan lokasi sekolah|
|US-05|Super admin|masuk ke dashboard dengan akun saya|hanya saya yang dapat mengubah konten|
|US-06|Super admin|menambah berita dan foto kegiatan|informasi sekolah selalu terbaru|
|US-07|Super admin|mengubah jadwal SPMB|informasi mengikuti keputusan sekolah|
|US-08|Super admin|menghapus konten yang sudah tidak berlaku|website tidak memuat informasi usang|
|US-09|Super admin|menyimpan konten sebagai draf|konten dapat diperiksa sebelum tayang|
|US-10|Super admin|menyimpan konten tanpa mengunggah foto|saya tetap dapat menayangkan informasi meskipun foto belum tersedia|

## 9A. Aturan Bisnis

1. Hanya ada **satu akun super admin**; tidak ada pendaftaran akun baru dari antarmuka.
2. Seluruh halaman publik dapat diakses tanpa login.
3. Seluruh perubahan data hanya dapat dilakukan melalui dashboard setelah login.
4. Hanya konten berstatus **terbit** yang tampil di website publik.
5. Nomor pribadi kepala sekolah tidak ditampilkan.
6. Data siswa tidak disimpan; hanya jumlah siswa per rombel yang ditampilkan.
7. Jadwal pendaftaran dan daftar ulang SPMB ditentukan super admin.
8. Hanya kolom wajib (Bagian 8.3) yang harus diisi; kolom opsional boleh dikosongkan.
9. Apabila foto tidak diunggah, website publik menampilkan **gambar pengganti (dummy/placeholder)** bawaan sistem. Super admin dapat menggantinya dengan foto asli kapan saja.
10. Kolom opsional yang kosong tidak boleh menyebabkan halaman error; kolom tersebut disembunyikan atau diganti keterangan seperti "Informasi belum tersedia".

## 10\. Kebutuhan Non-Fungsional (Tingkat PRD)

|Aspek|Kebutuhan|
|-|-|
|Responsif|Tampilan nyaman pada ponsel, tablet, dan desktop|
|Kinerja|Halaman utama termuat cepat; gambar dikompresi|
|Keamanan|Kata sandi tersimpan terenkripsi; dashboard hanya dapat diakses setelah login; unggahan dibatasi jenis dan ukuran berkas|
|Kegunaan|Dashboard sederhana, label berbahasa Indonesia|
|SEO dasar|Judul dan deskripsi halaman, struktur heading yang rapi|
|Ketersediaan|Dapat diakses publik setiap saat melalui hosting yang disepakati|
|Pemeliharaan|Konten dapat diubah tanpa mengubah kode|

Rincian teknis dituangkan pada SRS.

## 11\. Dependensi Data dan Konten

Data berikut dikumpulkan dari pihak sekolah. Ketidaktersediaan data tidak menghentikan pengembangan; konten sementara dan gambar pengganti digunakan sampai data asli diserahkan.

|Data|Status|Penanggung jawab|
|-|-|-|
|Visi dan misi|Belum ada|Sekolah|
|Alamat lengkap dan tautan Google Maps|Belum ada|Sekolah|
|Tahun berdiri dan sejarah rinci|Parsial (hasil merger 3 SD)|Sekolah|
|NPSN, status, akreditasi|Belum ada|Sekolah|
|Daftar prestasi (sekitar 20) beserta tahun dan tingkat|Belum ada|Sekolah|
|Daftar wali kelas|Belum ada|Sekolah|
|Foto kegiatan dan prestasi|Tersedia, belum diserahkan|Pak Niko|
|Tautan Instagram dan TikTok|Belum ada|Ibu Ayu|
|Jadwal SPMB|Belum ada|Sekolah|
|Kanal kontak publik|Belum ditentukan|Sekolah|

## 12\. Rencana Rilis

|Tahap|Cakupan|Target|
|-|-|-|
|Tahap 1 (MVP)|Website publik inti, login admin, modul konten prioritas tahap 1, informasi SPMB dan pamflet|Desember 2026|
|Tahap 2|Modul ekstrakurikuler, fasilitas, guru, dan kelas|Setelah MVP dan uji coba sekolah|
|Tahap 3|Fitur P2 (pencarian, catatan aktivitas) dan penyempurnaan|Sesuai kebutuhan|

Uji penerimaan dilakukan oleh pihak sekolah (sekolah menyatakan bersedia).

## 13\. Asumsi

1. Target "Desember" yang dimaksud adalah Desember 2026.
2. Website bersifat informasi saja; pendaftaran SPMB tetap dilakukan melalui mekanisme sekolah.
3. Formulir pesan pengunjung **tidak** disertakan pada rilis ini karena website hanya bersifat informasi; halaman Hubungi Kami menampilkan alamat, jam operasional, peta, dan media sosial.
4. Satu super admin cukup untuk kebutuhan sekolah; pemulihan kata sandi dilakukan secara manual oleh pengembang.
5. Pihak sekolah menyediakan seluruh data dan dokumentasi (Pak Niko).
6. Sekolah memiliki 4 laptop yang dapat digunakan untuk mengelola dashboard.
7. Gambar pengganti (placeholder) disediakan oleh pengembang dan seragam untuk seluruh modul.

## 14\. Risiko

|Risiko|Dampak|Mitigasi|
|-|-|-|
|Data dan foto terlambat diserahkan|Jadwal mundur|Tetapkan tenggat penyerahan data; gunakan konten sementara dan gambar pengganti|
|Konten tidak diperbarui|Website tampak usang|Tetapkan penanggung jawab dan kebiasaan pembaruan berkas berkala|
|Akun super admin tunggal lupa kata sandi atau akun disalahgunakan|Konten tidak dapat dikelola atau berubah tanpa izin|Prosedur pemulihan manual; kata sandi kuat|
|Foto berukuran besar|Halaman lambat|Kompresi otomatis|
|Perbedaan istilah PPDB/SPMB|Kebingungan informasi|Seragamkan istilah menjadi SPMB|
|Gambar pengganti terlalu lama dipakai|Website tampak kurang meyakinkan|Pengingat bagi super admin untuk melengkapi foto asli|

## 15\. Pertanyaan Terbuka

|No|Pertanyaan|Dampak pada dokumen|
|-|-|-|
|1|Apakah formulir pesan benar-benar tidak diperlukan?|PUB-14 dan modul pesan|
|2|Kanal kontak publik apa yang akan ditampilkan (nomor TU/admin, WhatsApp resmi, email)?|PUB-14|
|3|Pamflet "PPDB ke TK" (Q27) ditujukan untuk SPMB kelas 1 SD atau promosi ke TK?|PUB-13, modul pamflet|
|4|Jumlah guru kelas tercatat 11, sedangkan rombel 12|Data kelas dan guru|
|5|Apakah jam operasional Sabtu berlaku?|Jam operasional|
|6|Siapa yang mengisi data apabila super admin berhalangan?|Aturan bisnis dan risiko|
|7|Apakah sekolah sudah memiliki domain dan hosting?|Rencana rilis|
|8|Halaman publik ekstrakurikuler, fasilitas, serta kelas dan guru berprioritas P0, tetapi modul pengelolaannya berada di tahap 2. Apakah modul tersebut dimajukan ke tahap 1, atau halamannya memakai data tetap sementara?|PUB-05 s.d. PUB-07 dan Bagian 12|

## 16\. Langkah Selanjutnya

1. Verifikasi data dan pertanyaan terbuka bersama pihak sekolah.
2. Persetujuan PRD oleh pihak sekolah.
3. Penyusunan SRS (kebutuhan fungsional rinci, model data, antarmuka).
4. Perancangan wireframe frontend dan dashboard.

