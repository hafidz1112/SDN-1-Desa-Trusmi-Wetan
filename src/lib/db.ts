import { createClient, Client } from '@libsql/client';
import bcrypt from 'bcryptjs';
import path from 'path';

let client: Client | null = null;
let initialized = false;

export function getDb(): Client {
  if (!client) {
    const url = process.env.DATABASE_URL || `file:${path.resolve(process.cwd(), 'data', 'school.db')}`;
    const authToken = process.env.DATABASE_AUTH_TOKEN;
    client = createClient({
      url,
      authToken,
    });
  }
  return client;
}

export async function initDb() {
  if (initialized) return;
  const db = getDb();

  // Create tables according to SRS section 6
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      nama TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      failed_attempts INTEGER DEFAULT 0,
      locked_until TEXT,
      last_login_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT NOT NULL,
      original_name TEXT,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      data_base64 TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.execute('ALTER TABLE media ADD COLUMN data_base64 TEXT;');
  } catch {
    // Column already exists or table freshly created
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS school_identity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_sekolah TEXT NOT NULL DEFAULT 'SDN 1 Trusmi Wetan',
      npsn TEXT DEFAULT '20215577',
      status_sekolah TEXT DEFAULT 'Negeri',
      akreditasi TEXT DEFAULT 'A',
      alamat TEXT DEFAULT 'Desa Trusmi Wetan, Kec. Plered, Kabupaten Cirebon, Jawa Barat 45154',
      maps_url TEXT DEFAULT 'https://maps.google.com/?q=SDN+1+Trusmi+Wetan+Cirebon',
      logo_media_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.execute('ALTER TABLE school_identity ADD COLUMN logo_media_id INTEGER;');
  } catch {
    // Column already exists or table freshly created
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS operating_hours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hari TEXT NOT NULL UNIQUE,
      jam_buka TEXT,
      jam_tutup TEXT,
      is_libur INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS school_profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_kepala_sekolah TEXT DEFAULT 'Hj. Marpuah, S.Pd.',
      sambutan TEXT,
      foto_kepsek_media_id INTEGER,
      sejarah TEXT,
      sejarah_media_id INTEGER,
      visi TEXT,
      tujuan TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hero_title TEXT DEFAULT 'Membentuk Generasi Berkarakter, Cerdas, dan Berbudaya',
      hero_subtitle TEXT DEFAULT 'Selamat Datang di Website Resmi SDN 1 Trusmi Wetan, Wadah Pembelajaran Ramah Anak dan Berprestasi.',
      hero_media_id INTEGER,
      intro_text TEXT,
      stat_siswa INTEGER DEFAULT 312,
      stat_guru INTEGER DEFAULT 16,
      stat_rombel INTEGER DEFAULT 12,
      stat_prestasi INTEGER DEFAULT 20,
      academic_badge TEXT DEFAULT 'AKADEMIK & KEUNGGULAN',
      academic_title TEXT DEFAULT 'Belajar, Berkembang, Berprestasi.',
      academic_media_id INTEGER,
      academic_card_title TEXT DEFAULT 'Pendidikan Karakter Holistik',
      academic_card_subtitle TEXT DEFAULT 'Religi • Prestasi • Budi Pekerti',
      academic_features TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.execute('ALTER TABLE site_settings ADD COLUMN academic_badge TEXT DEFAULT "AKADEMIK & KEUNGGULAN";');
  } catch {}
  try {
    await db.execute('ALTER TABLE site_settings ADD COLUMN academic_title TEXT DEFAULT "Belajar, Berkembang, Berprestasi.";');
  } catch {}
  try {
    await db.execute('ALTER TABLE site_settings ADD COLUMN academic_media_id INTEGER;');
  } catch {}
  try {
    await db.execute('ALTER TABLE site_settings ADD COLUMN academic_card_title TEXT DEFAULT "Pendidikan Karakter Holistik";');
  } catch {}
  try {
    await db.execute('ALTER TABLE site_settings ADD COLUMN academic_card_subtitle TEXT DEFAULT "Religi • Prestasi • Budi Pekerti";');
  } catch {}
  try {
    await db.execute('ALTER TABLE site_settings ADD COLUMN academic_features TEXT;');
  } catch {}

  await db.execute(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      badge TEXT,
      title TEXT NOT NULL,
      subtitle TEXT,
      primary_btn_text TEXT DEFAULT 'PENDAFTARAN SPMB',
      primary_btn_href TEXT DEFAULT '/spmb',
      secondary_btn_text TEXT DEFAULT 'JELAJAHI PROFIL',
      secondary_btn_href TEXT DEFAULT '/profil',
      media_id INTEGER,
      urutan INTEGER DEFAULT 0,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telepon_publik TEXT DEFAULT '(0231) 321xxx',
      email_publik TEXT DEFAULT 'sdn1trusmiwetan@gmail.com',
      whatsapp TEXT DEFAULT '6281234567890',
      instagram_url TEXT DEFAULT 'https://instagram.com/sdn1trusmiwetan',
      tiktok_url TEXT DEFAULT 'https://tiktok.com/@sdn1trusmiwetan',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS spmb_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status_pendaftaran TEXT DEFAULT 'ditutup',
      teks_pengantar TEXT,
      info_pip_kip TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS spmb_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_dokumen TEXT NOT NULL,
      keterangan TEXT,
      urutan INTEGER DEFAULT 0,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS spmb_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tahap TEXT NOT NULL,
      tanggal_mulai TEXT NOT NULL,
      tanggal_selesai TEXT,
      keterangan TEXT,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS brochures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      media_id INTEGER NOT NULL,
      tahun INTEGER DEFAULT 2026,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poin_misi TEXT NOT NULL,
      urutan INTEGER DEFAULT 0,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      isi TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      media_id INTEGER,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_prestasi TEXT NOT NULL,
      peraih TEXT,
      tingkat TEXT,
      tahun INTEGER,
      media_id INTEGER,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      deskripsi TEXT,
      tanggal TEXT,
      is_rutin INTEGER DEFAULT 0,
      media_id INTEGER,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS gallery_albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_album TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      media_id INTEGER NOT NULL,
      keterangan TEXT,
      album_id INTEGER,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS extracurriculars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      deskripsi TEXT,
      pembina TEXT,
      jadwal TEXT,
      urutan INTEGER DEFAULT 0,
      media_id INTEGER,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      deskripsi TEXT,
      jumlah INTEGER,
      kondisi TEXT,
      media_id INTEGER,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      jabatan TEXT NOT NULL,
      mata_pelajaran TEXT,
      urutan INTEGER DEFAULT 0,
      media_id INTEGER,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_rombel TEXT NOT NULL,
      wali_kelas_id INTEGER,
      jumlah_siswa INTEGER,
      urutan INTEGER DEFAULT 0,
      status TEXT DEFAULT 'terbit',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      aksi TEXT NOT NULL,
      modul TEXT NOT NULL,
      entitas_id INTEGER,
      ringkasan TEXT,
      waktu TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default super admin if not exists
  const userCheck = await db.execute('SELECT COUNT(*) as cnt FROM users');
  if (Number(userCheck.rows[0].cnt) === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('AdminTrusmi123!', salt);
    await db.execute({
      sql: 'INSERT INTO users (username, nama, password_hash) VALUES (?, ?, ?)',
      args: ['admin', 'Pak Niko Rindi Mulyana', hash],
    });
  }

  // Seed single records if empty
  const identityCheck = await db.execute('SELECT COUNT(*) as cnt FROM school_identity');
  if (Number(identityCheck.rows[0].cnt) === 0) {
    await db.execute(`
      INSERT INTO school_identity (nama_sekolah, npsn, status_sekolah, akreditasi, alamat, maps_url)
      VALUES (
        'SDN 1 Trusmi Wetan',
        '20215577',
        'Negeri',
        'A',
        'Desa Trusmi Wetan, Kec. Plered, Kabupaten Cirebon, Jawa Barat 45154',
        'https://maps.google.com/?q=SDN+1+Trusmi+Wetan+Cirebon'
      );
    `);
  }

  const hoursCheck = await db.execute('SELECT COUNT(*) as cnt FROM operating_hours');
  if (Number(hoursCheck.rows[0].cnt) === 0) {
    const hours = [
      { hari: 'Senin', jam_buka: '07:00', jam_tutup: '12:10', is_libur: 0 },
      { hari: 'Selasa', jam_buka: '07:00', jam_tutup: '12:10', is_libur: 0 },
      { hari: 'Rabu', jam_buka: '07:00', jam_tutup: '12:10', is_libur: 0 },
      { hari: 'Kamis', jam_buka: '07:00', jam_tutup: '12:10', is_libur: 0 },
      { hari: 'Jumat', jam_buka: '07:00', jam_tutup: '11:00', is_libur: 0 },
      { hari: 'Sabtu', jam_buka: '07:00', jam_tutup: '11:30', is_libur: 0 },
      { hari: 'Minggu', jam_buka: null, jam_tutup: null, is_libur: 1 },
    ];
    for (const h of hours) {
      await db.execute({
        sql: 'INSERT INTO operating_hours (hari, jam_buka, jam_tutup, is_libur) VALUES (?, ?, ?, ?)',
        args: [h.hari, h.jam_buka, h.jam_tutup, h.is_libur],
      });
    }
  }

  const profileCheck = await db.execute('SELECT COUNT(*) as cnt FROM school_profile');
  if (Number(profileCheck.rows[0].cnt) === 0) {
    await db.execute(`
      INSERT INTO school_profile (nama_kepala_sekolah, sambutan, sejarah, visi, tujuan)
      VALUES (
        'Hj. Marpuah, S.Pd.',
        'Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di website resmi SDN 1 Trusmi Wetan. Kehadiran portal informasi ini merupakan komitmen kami dalam mewujudkan keterbukaan informasi publik, mempererat silaturahmi dengan orang tua murid serta masyarakat, dan menampilkan berbagai capaian prestasi siswa kami. Kami bertekad membentuk generasi berakhlak mulia, cerdas, kreatif, dan berwawasan lingkungan dengan tetap menjunjung tinggi nilai-nilai kearifan lokal Desa Trusmi yang sarat budaya.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.',
        'SDN 1 Trusmi Wetan terletak di kawasan sentra kerajinan batik Trusmi yang bersejarah di Kecamatan Plered, Kabupaten Cirebon. Sekolah ini merupakan hasil penggabungan (merger) tiga sekolah dasar untuk menyatukan kekuatan pendidik, sarana prasarana, serta mewujudkan pusat pembelajaran dasar yang lebih berkualitas dan terpadu. Hingga kini, SDN 1 Trusmi Wetan telah melahirkan berbagai prestasi baik di bidang akademik maupun non-akademik di tingkat kecamatan hingga kabupaten.',
        'Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Berprestasi, dan Berwawasan Lingkungan.',
        '1. Menyelenggarakan proses pembelajaran yang inovatif dan berorientasi pada pembentukan karakter profil pelajar pancasila.\n2. Mengoptimalkan potensi minat dan bakat siswa melalui beragam ekstrakurikuler pilihan.\n3. Membangun sinergi harmonis antara pihak sekolah, komite sekolah, dan masyarakat sekitar.'
      );
    `);
  }

  const settingsCheck = await db.execute('SELECT COUNT(*) as cnt FROM site_settings');
  if (Number(settingsCheck.rows[0].cnt) === 0) {
    await db.execute(`
      INSERT INTO site_settings (hero_title, hero_subtitle, intro_text, stat_siswa, stat_guru, stat_rombel, stat_prestasi)
      VALUES (
        'Membentuk Generasi Berkarakter, Cerdas, dan Berbudaya',
        'Selamat Datang di Website Resmi SDN 1 Trusmi Wetan, Sekolah Ramah Anak di Pusat Budaya Trusmi.',
        'SDN 1 Trusmi Wetan berdedikasi memberikan pendidikan dasar berkualitas tinggi dengan kurikulum yang menumbuhkan kreativitas, kemandirian, dan budi pekerti luhur bagi seluruh siswa.',
        312, 16, 12, 20
      );
    `);
  }

  const slidesCheck = await db.execute('SELECT COUNT(*) as cnt FROM hero_slides');
  if (Number(slidesCheck.rows[0].cnt) === 0) {
    const currentSettings = await db.execute('SELECT hero_title, hero_subtitle, hero_media_id FROM site_settings LIMIT 1');
    const s1 = currentSettings.rows[0];
    const s1Title = (s1?.hero_title as string) || 'Membentuk Generasi Cerdas, Berkarakter & Berprestasi';
    const s1Subtitle =
      (s1?.hero_subtitle as string) ||
      'Di SDN 1 Trusmi Wetan, kami membina generasi muda yang berakhlak mulia, cerdas, berprestasi, dan berwawasan lingkungan melalui kurikulum yang menginspirasi.';
    const s1MediaId = (s1?.hero_media_id as number) || null;

    await db.execute({
      sql: `INSERT INTO hero_slides (badge, title, subtitle, primary_btn_text, primary_btn_href, secondary_btn_text, secondary_btn_href, media_id, urutan, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'Sekolah Dasar Negeri Unggulan & Berkarakter',
        s1Title,
        s1Subtitle,
        'PENDAFTARAN SPMB',
        '/spmb',
        'JELAJAHI PROFIL',
        '/profil',
        s1MediaId,
        1,
        'terbit',
      ],
    });

    await db.execute({
      sql: `INSERT INTO hero_slides (badge, title, subtitle, primary_btn_text, primary_btn_href, secondary_btn_text, secondary_btn_href, media_id, urutan, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'Penerimaan Peserta Didik Baru (SPMB 2026/2027)',
        'Pintu Gerbang Menuju Masa Depan Anak Gemilang',
        'Pendidikan dasar holistik dengan bimbingan pendidik tersertifikasi serta sarana prasarana ramah anak yang siap mendampingi tumbuh kembang anak didik.',
        'INFORMASI SPMB',
        '/spmb',
        'LIHAT FASILITAS',
        '/sarana-prasarana',
        null,
        2,
        'terbit',
      ],
    });

    await db.execute({
      sql: `INSERT INTO hero_slides (badge, title, subtitle, primary_btn_text, primary_btn_href, secondary_btn_text, secondary_btn_href, media_id, urutan, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'Terakreditasi A • Kemendikbudristek RI',
        'Mengukir Prestasi, Menumbuhkan Budi Pekerti',
        'Aktif mencetak insan unggul di bidang akademik, keagamaan, dan seni kreasi dengan lingkungan belajar yang asri, aman, dan kondusif.',
        'LIHAT PRESTASI',
        '/prestasi',
        'HUBUNGI KAMI',
        '/hubungi-kami',
        null,
        3,
        'terbit',
      ],
    });
  }

  const contactCheck = await db.execute('SELECT COUNT(*) as cnt FROM contact_info');
  if (Number(contactCheck.rows[0].cnt) === 0) {
    await db.execute(`
      INSERT INTO contact_info (telepon_publik, email_publik, whatsapp, instagram_url, tiktok_url)
      VALUES (
        '(0231) 321890',
        'sdn1trusmiwetan@gmail.com',
        '6281234567890',
        'https://instagram.com/sdn1trusmiwetan',
        'https://tiktok.com/@sdn1trusmiwetan'
      );
    `);
  }

  const spmbCheck = await db.execute('SELECT COUNT(*) as cnt FROM spmb_settings');
  if (Number(spmbCheck.rows[0].cnt) === 0) {
    await db.execute(`
      INSERT INTO spmb_settings (status_pendaftaran, teks_pengantar, info_pip_kip)
      VALUES (
        'ditutup',
        'Informasi Penerimaan Murid Baru (SPMB) Tahun Pelajaran 2027/2028 SDN 1 Trusmi Wetan. Seluruh proses pendaftaran fisik dilakukan di ruang panitia SPMB sekolah tanpa dipungut biaya pendaftaran.',
        'SDN 1 Trusmi Wetan memfasilitasi dan mendampingi pencairan bantuan Program Indonesia Pintar (PIP) / Kartu Indonesia Pintar (KIP) bagi calon murid dan peserta didik dari keluarga kurang mampu. Calon wali murid dapat melampirkan fotokopi KIP/KKS/PKH saat menyerahkan berkas.'
      );
    `);
  }

  // Seed Missions
  const missionsCheck = await db.execute('SELECT COUNT(*) as cnt FROM missions');
  if (Number(missionsCheck.rows[0].cnt) === 0) {
    const defaultMissions = [
      'Menanamkan nilai-nilai keagamaan, kejujuran, dan budi pekerti luhur dalam keseharian siswa.',
      'Melaksanakan pembelajaran aktif, inovatif, kreatif, dan ramah anak yang berpusat pada murid.',
      'Mengembangkan potensi, minat, dan bakat siswa melalui program ekstrakurikuler terarah.',
      'Menciptakan lingkungan sekolah yang bersih, sehat, aman, asri, dan peduli kelestarian lingkungan.',
      'Menumbuhkan rasa bangga terhadap seni dan warisan budaya lokal batik Trusmi Cirebon.'
    ];
    for (let i = 0; i < defaultMissions.length; i++) {
      await db.execute({
        sql: 'INSERT INTO missions (poin_misi, urutan, status) VALUES (?, ?, ?)',
        args: [defaultMissions[i], i + 1, 'terbit'],
      });
    }
  }

  // Seed SPMB Requirements
  const reqCheck = await db.execute('SELECT COUNT(*) as cnt FROM spmb_requirements');
  if (Number(reqCheck.rows[0].cnt) === 0) {
    const defaultReqs = [
      { nama: 'Akta Kelahiran Calon Murid', ket: 'Fotokopi 2 lembar (membawa dokumen asli untuk verifikasi)', urutan: 1 },
      { nama: 'Kartu Keluarga (KK)', ket: 'Fotokopi 2 lembar yang mencantumkan nama calon murid', urutan: 2 },
      { nama: 'KTP Orang Tua / Wali Murid', ket: 'Fotokopi KTP Ayah dan Ibu/Wali masing-masing 1 lembar', urutan: 3 },
      { nama: 'Pas Foto Calon Murid (3x4)', ket: 'Sebanyak 3 lembar dengan latar belakang merah atau biru', urutan: 4 },
      { nama: 'Ijazah / Surat Tanda Serta Belajar TK/RA', ket: 'Fotokopi 1 lembar (bagi yang lulus TK/PAUD/RA)', urutan: 5 },
      { nama: 'Kartu Bantuan Sosial (PIP / KIP / PKH / KKS)', ket: 'Fotokopi 1 lembar bagi keluarga pemegang kartu bantuan', urutan: 6 },
    ];
    for (const r of defaultReqs) {
      await db.execute({
        sql: 'INSERT INTO spmb_requirements (nama_dokumen, keterangan, urutan, status) VALUES (?, ?, ?, ?)',
        args: [r.nama, r.ket, r.urutan, 'terbit'],
      });
    }
  }

  // Seed SPMB Schedules
  const schCheck = await db.execute('SELECT COUNT(*) as cnt FROM spmb_schedules');
  if (Number(schCheck.rows[0].cnt) === 0) {
    await db.execute({
      sql: `INSERT INTO spmb_schedules (tahap, tanggal_mulai, tanggal_selesai, keterangan, status)
            VALUES (?, ?, ?, ?, ?)`,
      args: ['pendaftaran', '2027-06-21', '2027-07-02', 'Penyerahan dan verifikasi berkas pendaftaran di Ruang Panitia SPMB SDN 1 Trusmi Wetan (Pukul 08.00 - 12.00 WIB)', 'terbit']
    });
    await db.execute({
      sql: `INSERT INTO spmb_schedules (tahap, tanggal_mulai, tanggal_selesai, keterangan, status)
            VALUES (?, ?, ?, ?, ?)`,
      args: ['daftar_ulang', '2027-07-05', '2027-07-09', 'Daftar ulang peserta didik yang diterima, penandatanganan tata tertib, dan informasi masa pengenalan lingkungan sekolah (MPLS)', 'terbit']
    });
  }

  // Seed News
  const newsCheck = await db.execute('SELECT COUNT(*) as cnt FROM news');
  if (Number(newsCheck.rows[0].cnt) === 0) {
    const sampleNews = [
      {
        judul: 'Peringatan Hari Guru Nasional dan Apresiasi Pendidik Inspiratif',
        slug: 'peringatan-hari-guru-nasional-2026',
        tanggal: '2026-11-25',
        isi: 'Keluarga besar SDN 1 Trusmi Wetan menyelenggarakan upacara peringatan Hari Guru Nasional dengan penuh khidmat. Kegiatan dirangkai dengan pentas seni persembahan para siswa serta pemberian penghargaan kepada para pendidik teladan yang telah mendedikasikan ilmu bagi kemajuan generasi muda di Trusmi Wetan.'
      },
      {
        judul: 'Sosialisasi Program Indonesia Pintar (PIP) untuk Wali Murid',
        slug: 'sosialisasi-program-indonesia-pintar-pip-wali-murid',
        tanggal: '2026-11-10',
        isi: 'Pihak sekolah mengundang seluruh orang tua dan wali murid penerima bantuan Program Indonesia Pintar (PIP) untuk menerima sosialisasi mengenai prosedur pencairan dan pemanfaatan dana bantuan guna memenuhi perlengkapan sekolah siswa secara transparan.'
      },
      {
        judul: 'Kegiatan Pembiasaan Salat Duha Berjamaah Tingkatkan Karakter Siswa',
        slug: 'pembiasaan-salat-duha-berjamaah-karakter-siswa',
        tanggal: '2026-10-28',
        isi: 'Setiap Jumat pagi, seluruh siswa kelas 1 hingga 6 bersama dewan guru melaksanakan salat Duha berjamaah dan tadarus bersama di lapangan sekolah. Pembiasaan religius ini menjadi fondasi karakter mulia dan disiplin bagi seluruh warga sekolah.'
      }
    ];
    for (const n of sampleNews) {
      await db.execute({
        sql: 'INSERT INTO news (judul, slug, isi, tanggal, status) VALUES (?, ?, ?, ?, ?)',
        args: [n.judul, n.slug, n.isi, n.tanggal, 'terbit']
      });
    }
  }

  // Seed Achievements (PRD mentions around 20 achievements)
  const achCheck = await db.execute('SELECT COUNT(*) as cnt FROM achievements');
  if (Number(achCheck.rows[0].cnt) === 0) {
    const sampleAchievements = [
      { nama: 'Juara 1 Lomba Pasukan Baris Berbaris (PBB)', peraih: 'Tim PBB SDN 1 Trusmi Wetan', tingkat: 'Kabupaten', tahun: 2026 },
      { nama: 'Juara 1 Lomba Seni Tari Tradisional Kreasi Daerah', peraih: 'Sanggar Seni Siswa', tingkat: 'Kecamatan', tahun: 2026 },
      { nama: 'Juara 2 Karate Kata Perorangan Putra', peraih: 'Ahmad Faiz (Siswa Kelas 5)', tingkat: 'Kabupaten', tahun: 2026 },
      { nama: 'Juara 1 Lomba Tenis Meja Tunggal Putra O2SN', peraih: 'Rizky Ramadhan', tingkat: 'Kecamatan', tahun: 2025 },
      { nama: 'Juara Harapan 1 Olimpiade Matematika SD', peraih: 'Nabila Az-Zahra', tingkat: 'Kabupaten', tahun: 2025 },
      { nama: 'Juara 1 Lomba Catur Pelajar Tingkat SD', peraih: 'Dimas Setiawan', tingkat: 'Kecamatan', tahun: 2025 },
      { nama: 'Juara 2 Drumband Junior Festival Pelajar', peraih: 'Gita Bahana Trusmi', tingkat: 'Kabupaten', tahun: 2024 },
      { nama: 'Sekolah Adiwiyata Tingkat Kecamatan', peraih: 'SDN 1 Trusmi Wetan', tingkat: 'Kecamatan', tahun: 2024 }
    ];
    for (const a of sampleAchievements) {
      await db.execute({
        sql: 'INSERT INTO achievements (nama_prestasi, peraih, tingkat, tahun, status) VALUES (?, ?, ?, ?, ?)',
        args: [a.nama, a.peraih, a.tingkat, a.tahun, 'terbit']
      });
    }
  }

  // Seed Activities (including routine activities as per PRD/SRS)
  const actCheck = await db.execute('SELECT COUNT(*) as cnt FROM activities');
  if (Number(actCheck.rows[0].cnt) === 0) {
    const sampleActivities = [
      {
        judul: 'Salat Duha Berjamaah & Tadarus Al-Qur’an',
        slug: 'salat-duha-berjamaah-dan-tadarus',
        deskripsi: 'Kegiatan pembiasaan ibadah bersama setiap hari Jumat pagi untuk melatih keistiqamahan spiritual seluruh peserta didik.',
        tanggal: '2026-11-14',
        is_rutin: 1
      },
      {
        judul: 'Senam Sehat Sabtu Bersama',
        slug: 'senam-sehat-sabtu-bersama',
        deskripsi: 'Kegiatan kebugaran jasmani bersama guru dan siswa setiap Sabtu pagi sebelum memulai pembelajaran ekstrakurikuler.',
        tanggal: '2026-11-15',
        is_rutin: 1
      },
      {
        judul: 'Upacara Bendera Setiap Senin',
        slug: 'upacara-bendera-senin',
        deskripsi: 'Penanaman jiwa nasionalisme, kedisiplinan, dan penghormatan kepada pahlawan melalui upacara rutin hari Senin.',
        tanggal: '2026-11-17',
        is_rutin: 1
      },
      {
        judul: 'Les Tambahan Pembinaan Akademik',
        slug: 'les-tambahan-pembinaan-akademik',
        deskripsi: 'Bimbingan belajar intensif sepulang sekolah untuk persiapan asesmen dan pengayaan materi pelajaran utama.',
        tanggal: '2026-11-12',
        is_rutin: 1
      },
      {
        judul: 'Pentas Seni Kreasi Budaya Batik Trusmi',
        slug: 'pentas-seni-kreasi-budaya-batik-trusmi',
        deskripsi: 'Pameran karya siswa membatik sederhana dan peragaan busana kreasi kain batik Trusmi dalam rangka gelar karya Projek Penguatan Profil Pelajar Pancasila (P5).',
        tanggal: '2026-10-15',
        is_rutin: 0
      }
    ];
    for (const act of sampleActivities) {
      await db.execute({
        sql: 'INSERT INTO activities (judul, slug, deskripsi, tanggal, is_rutin, status) VALUES (?, ?, ?, ?, ?, ?)',
        args: [act.judul, act.slug, act.deskripsi, act.tanggal, act.is_rutin, 'terbit']
      });
    }
  }

  // Seed Extracurriculars
  const exCheck = await db.execute('SELECT COUNT(*) as cnt FROM extracurriculars');
  if (Number(exCheck.rows[0].cnt) === 0) {
    const defaultEx = [
      { nama: 'Gerakan Pramuka', deskripsi: 'Membentuk kemandirian, kepemimpinan, kepedulian sosial, dan kecakapan hidup bagi para penggalang dan siaga.', pembina: 'Kak Supriyadi, S.Pd.', jadwal: 'Jumat, 14.00 - 16.00 WIB', urutan: 1 },
      { nama: 'Karate', deskripsi: 'Olahraga bela diri pembentuk ketahanan fisik, fokus mental, dan sportivitas tinggi.', pembina: 'Sensei Hendra', jadwal: 'Sabtu, 08.00 - 10.00 WIB', urutan: 2 },
      { nama: 'Drumband (Gita Bahana)', deskripsi: 'Pelatihan musikalitas, kedisiplinan ritme, dan kekompakan tim perkusi serta marching bell.', pembina: 'Ibu Ratna Dewi, S.Pd.', jadwal: 'Kamis, 14.00 - 16.00 WIB', urutan: 3 },
      { nama: 'Tenis Meja', deskripsi: 'Pengembangan kelincahan, refleks tangan, dan teknik permainan tenis meja berprestasi.', pembina: 'Pak Ahmad Fauzi, S.Pd.', jadwal: 'Selasa, 14.30 - 16.00 WIB', urutan: 4 },
      { nama: 'Seni Tari Tradisional Batik', deskripsi: 'Melestarikan seni tari daerah khas Cirebon dan olah gerak bertema kearifan lokal Trusmi.', pembina: 'Ibu Siti Munawaroh, S.Sn.', jadwal: 'Rabu, 14.00 - 15.30 WIB', urutan: 5 },
      { nama: 'Bola Voli Mini', deskripsi: 'Olahraga beregu yang melatih kerja sama tim, kebugaran jasmani, dan teknik dasar bola voli.', pembina: 'Pak Didin Syamsudin, S.Pd.Jas.', jadwal: 'Sabtu, 10.00 - 11.30 WIB', urutan: 6 },
    ];
    for (const ex of defaultEx) {
      await db.execute({
        sql: 'INSERT INTO extracurriculars (nama, deskripsi, pembina, jadwal, urutan, status) VALUES (?, ?, ?, ?, ?, ?)',
        args: [ex.nama, ex.deskripsi, ex.pembina, ex.jadwal, ex.urutan, 'terbit']
      });
    }
  }

  // Seed Facilities
  const facCheck = await db.execute('SELECT COUNT(*) as cnt FROM facilities');
  if (Number(facCheck.rows[0].cnt) === 0) {
    const defaultFacs = [
      { nama: 'Ruang Kelas Nyaman', deskripsi: '12 ruang rombel dilengkapi papan tulis representatif, meja kursi ergonomis, pencahayaan alami, dan ventilasi yang memadai.', jumlah: 12, kondisi: 'Baik' },
      { nama: 'Perpustakaan Sekolah', deskripsi: 'Koleksi buku bacaan anak, buku pengayaan kurikulum merdeka, ensiklopedia, dan ruang baca santai berkarpet.', jumlah: 1, kondisi: 'Baik' },
      { nama: 'Laboratorium Chromebook / Komputer', deskripsi: 'Fasilitas perangkat Chromebook bantuan pemerintah untuk pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) dan literasi digital.', jumlah: 30, kondisi: 'Baik' },
      { nama: 'Lapangan Serbaguna', deskripsi: 'Lapangan terbuka untuk upacara bendera, senam bersama, kegiatan olahraga bola voli mini, bulutangkis, dan latihan drumband.', jumlah: 1, kondisi: 'Baik' },
      { nama: 'Unit Kesehatan Sekolah (UKS)', deskripsi: 'Ruang pertolongan pertama pada kecelakaan/sakit ringan, dilengkapi tempat tidur periksa dan obat-obatan standar.', jumlah: 1, kondisi: 'Baik' },
      { nama: 'Musholla Sekolah', deskripsi: 'Tempat ibadah salat zuhur dan kegiatan bimbingan rohani Islam peserta didik dan guru.', jumlah: 1, kondisi: 'Baik' },
    ];
    for (const f of defaultFacs) {
      await db.execute({
        sql: 'INSERT INTO facilities (nama, deskripsi, jumlah, kondisi, status) VALUES (?, ?, ?, ?, ?)',
        args: [f.nama, f.deskripsi, f.jumlah, f.kondisi, 'terbit']
      });
    }
  }

  // Seed Staff (Guru & Tendik)
  const staffCheck = await db.execute('SELECT COUNT(*) as cnt FROM staff');
  if (Number(staffCheck.rows[0].cnt) === 0) {
    const defaultStaff = [
      { nama: 'Hj. Marpuah, S.Pd.', jabatan: 'Kepala Sekolah', mata_pelajaran: 'Manajerial & Supervisi', urutan: 1 },
      { nama: 'Supriyadi, S.Pd.', jabatan: 'Guru Kelas 1A', mata_pelajaran: 'Guru Kelas', urutan: 2 },
      { nama: 'Sri Wahyuni, S.Pd.SD.', jabatan: 'Guru Kelas 1B', mata_pelajaran: 'Guru Kelas', urutan: 3 },
      { nama: 'Ahmad Fauzi, S.Pd.', jabatan: 'Guru Kelas 2A', mata_pelajaran: 'Guru Kelas', urutan: 4 },
      { nama: 'Ratna Dewi, S.Pd.', jabatan: 'Guru Kelas 2B', mata_pelajaran: 'Guru Kelas', urutan: 5 },
      { nama: 'Bambang Irawan, S.Pd.', jabatan: 'Guru Kelas 3A', mata_pelajaran: 'Guru Kelas', urutan: 6 },
      { nama: 'Endang Kusmiati, S.Pd.', jabatan: 'Guru Kelas 3B', mata_pelajaran: 'Guru Kelas', urutan: 7 },
      { nama: 'Iwan Setiawan, S.Pd.', jabatan: 'Guru Kelas 4A', mata_pelajaran: 'Guru Kelas', urutan: 8 },
      { nama: 'Nurul Hidayati, S.Pd.', jabatan: 'Guru Kelas 4B', mata_pelajaran: 'Guru Kelas', urutan: 9 },
      { nama: 'Didin Syamsudin, S.Pd.Jas.', jabatan: 'Guru PJOK', mata_pelajaran: 'Pendidikan Jasmani Olahraga Kesehatan', urutan: 10 },
      { nama: 'Ust. Mahmudin, S.Ag.', jabatan: 'Guru Agama Islam', mata_pelajaran: 'Pendidikan Agama Islam & Budi Pekerti', urutan: 11 },
      { nama: 'Niko Rindi Mulyana, S.Kom.', jabatan: 'Operator & Tenaga Kependidikan', mata_pelajaran: 'Sistem Informasi & Dapodik', urutan: 12 },
    ];
    for (const s of defaultStaff) {
      await db.execute({
        sql: 'INSERT INTO staff (nama, jabatan, mata_pelajaran, urutan, status) VALUES (?, ?, ?, ?, ?)',
        args: [s.nama, s.jabatan, s.mata_pelajaran, s.urutan, 'terbit']
      });
    }
  }

  // Seed Classes (12 Rombel as per PRD)
  const classCheck = await db.execute('SELECT COUNT(*) as cnt FROM classes');
  if (Number(classCheck.rows[0].cnt) === 0) {
    const defaultClasses = [
      { nama_rombel: 'Kelas 1A', wali_kelas_id: 2, jumlah_siswa: 26, urutan: 1 },
      { nama_rombel: 'Kelas 1B', wali_kelas_id: 3, jumlah_siswa: 25, urutan: 2 },
      { nama_rombel: 'Kelas 2A', wali_kelas_id: 4, jumlah_siswa: 27, urutan: 3 },
      { nama_rombel: 'Kelas 2B', wali_kelas_id: 5, jumlah_siswa: 26, urutan: 4 },
      { nama_rombel: 'Kelas 3A', wali_kelas_id: 6, jumlah_siswa: 25, urutan: 5 },
      { nama_rombel: 'Kelas 3B', wali_kelas_id: 7, jumlah_siswa: 26, urutan: 6 },
      { nama_rombel: 'Kelas 4A', wali_kelas_id: 8, jumlah_siswa: 28, urutan: 7 },
      { nama_rombel: 'Kelas 4B', wali_kelas_id: 9, jumlah_siswa: 27, urutan: 8 },
      { nama_rombel: 'Kelas 5A', wali_kelas_id: 6, jumlah_siswa: 26, urutan: 9 },
      { nama_rombel: 'Kelas 5B', wali_kelas_id: 7, jumlah_siswa: 25, urutan: 10 },
      { nama_rombel: 'Kelas 6A', wali_kelas_id: 8, jumlah_siswa: 26, urutan: 11 },
      { nama_rombel: 'Kelas 6B', wali_kelas_id: 9, jumlah_siswa: 25, urutan: 12 },
    ];
    for (const c of defaultClasses) {
      await db.execute({
        sql: 'INSERT INTO classes (nama_rombel, wali_kelas_id, jumlah_siswa, urutan, status) VALUES (?, ?, ?, ?, ?)',
        args: [c.nama_rombel, c.wali_kelas_id, c.jumlah_siswa, c.urutan, 'terbit']
      });
    }
  }

  // Seed Gallery Albums
  const albCheck = await db.execute('SELECT COUNT(*) as cnt FROM gallery_albums');
  if (Number(albCheck.rows[0].cnt) === 0) {
    const albums = ['Kegiatan Belajar & Mengajar', 'Prestasi Siswa', 'Upacara & Peringatan Hari Besar', 'Fasilitas & Lingkungan Sekolah'];
    for (const a of albums) {
      await db.execute({
        sql: 'INSERT INTO gallery_albums (nama_album) VALUES (?)',
        args: [a]
      });
    }
  }

  initialized = true;
}

function toPlainObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return (typeof obj === 'bigint' ? Number(obj) : obj) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(toPlainObject) as unknown as T;
  }
  const plain: Record<string, any> = {};
  for (const key of Object.keys(obj as any)) {
    plain[key] = toPlainObject((obj as any)[key]);
  }
  return plain as T;
}

export async function query<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  await initDb();
  const db = getDb();
  const res = await db.execute({ sql, args });
  return toPlainObject(res.rows || []) as unknown as T[];
}

export async function queryOne<T = any>(sql: string, args: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, args);
  return rows[0] || null;
}
