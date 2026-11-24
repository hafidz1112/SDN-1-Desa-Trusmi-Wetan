import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';

    const result: Record<string, any> = {};

    if (type === 'all' || type === 'identity') {
      const res = await db.execute(`
        SELECT s.*, m.file_path as logo_url
        FROM school_identity s
        LEFT JOIN media m ON s.logo_media_id = m.id
        LIMIT 1
      `);
      result.identity = res.rows[0] || null;
    }

    if (type === 'all' || type === 'operating_hours') {
      const res = await db.execute('SELECT * FROM operating_hours ORDER BY id ASC');
      result.operating_hours = res.rows;
    }

    if (type === 'all' || type === 'profile') {
      const res = await db.execute(`
        SELECT p.*,
          m1.file_path as foto_kepsek_url,
          m2.file_path as sejarah_foto_url
        FROM school_profile p
        LEFT JOIN media m1 ON p.foto_kepsek_media_id = m1.id
        LEFT JOIN media m2 ON p.sejarah_media_id = m2.id
        LIMIT 1
      `);
      result.profile = res.rows[0] || null;
    }

    if (type === 'all' || type === 'beranda') {
      const res = await db.execute(`
        SELECT s.*,
          m.file_path as hero_media_url,
          m2.file_path as academic_media_url
        FROM site_settings s
        LEFT JOIN media m ON s.hero_media_id = m.id
        LEFT JOIN media m2 ON s.academic_media_id = m2.id
        LIMIT 1
      `);
      result.beranda = res.rows[0] || null;

      const slidesRes = await db.execute(`
        SELECT s.*, m.file_path as bg_image
        FROM hero_slides s
        LEFT JOIN media m ON s.media_id = m.id
        ORDER BY s.urutan ASC, s.id ASC
      `);
      result.hero_slides = slidesRes.rows;
    }

    if (type === 'all' || type === 'contact') {
      const res = await db.execute('SELECT * FROM contact_info LIMIT 1');
      result.contact = res.rows[0] || null;
    }

    if (type === 'all' || type === 'spmb') {
      const res = await db.execute('SELECT * FROM spmb_settings LIMIT 1');
      result.spmb = res.rows[0] || null;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data pengaturan' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    await initDb();
    const db = getDb();
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ success: false, message: 'Tipe dan data harus diisi' }, { status: 400 });
    }

    if (type === 'identity') {
      // nama_sekolah is mandatory (SRS FR-ADM-014)
      if (!data.nama_sekolah || !data.nama_sekolah.trim()) {
        return NextResponse.json({ success: false, message: 'Nama sekolah wajib diisi' }, { status: 400 });
      }

      await db.execute({
        sql: `UPDATE school_identity SET
          nama_sekolah = ?,
          npsn = ?,
          status_sekolah = ?,
          akreditasi = ?,
          alamat = ?,
          maps_url = ?,
          logo_media_id = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM school_identity LIMIT 1)`,
        args: [
          data.nama_sekolah.trim(),
          data.npsn || null,
          data.status_sekolah || null,
          data.akreditasi || null,
          data.alamat || null,
          data.maps_url || null,
          data.logo_media_id || null,
        ],
      });
      await logAudit('ubah', 'Identitas Sekolah', undefined, 'Memperbarui identitas dan logo sekolah');
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/identitas');
    } else if (type === 'operating_hours') {
      // Validate hours: if not libur, jam_tutup must be after jam_buka (FR-ADM-016)
      for (const h of data) {
        if (!h.is_libur && h.jam_buka && h.jam_tutup) {
          if (h.jam_tutup <= h.jam_buka) {
            return NextResponse.json(
              { success: false, message: `Jam tutup hari ${h.hari} harus lebih besar dari jam buka` },
              { status: 400 }
            );
          }
        }
        await db.execute({
          sql: `UPDATE operating_hours SET
            jam_buka = ?,
            jam_tutup = ?,
            is_libur = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE hari = ?`,
          args: [
            h.is_libur ? null : (h.jam_buka || null),
            h.is_libur ? null : (h.jam_tutup || null),
            h.is_libur ? 1 : 0,
            h.hari,
          ],
        });
      }
      await logAudit('ubah', 'Jam Operasional', undefined, 'Memperbarui jam operasional sekolah');
    } else if (type === 'profile') {
      await db.execute({
        sql: `UPDATE school_profile SET
          nama_kepala_sekolah = ?,
          sambutan = ?,
          foto_kepsek_media_id = ?,
          sejarah = ?,
          sejarah_media_id = ?,
          visi = ?,
          tujuan = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM school_profile LIMIT 1)`,
        args: [
          data.nama_kepala_sekolah || null,
          data.sambutan || null,
          data.foto_kepsek_media_id || null,
          data.sejarah || null,
          data.sejarah_media_id || null,
          data.visi || null,
          data.tujuan || null,
        ],
      });
      await logAudit('ubah', 'Profil Sekolah', undefined, 'Memperbarui profil, visi, dan sambutan');
    } else if (type === 'beranda') {
      await db.execute({
        sql: `UPDATE site_settings SET
          hero_title = ?,
          hero_subtitle = ?,
          hero_media_id = ?,
          intro_text = ?,
          stat_siswa = ?,
          stat_guru = ?,
          stat_rombel = ?,
          stat_prestasi = ?,
          academic_badge = ?,
          academic_title = ?,
          academic_media_id = ?,
          academic_card_title = ?,
          academic_card_subtitle = ?,
          academic_features = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM site_settings LIMIT 1)`,
        args: [
          data.hero_title || null,
          data.hero_subtitle || null,
          data.hero_media_id || null,
          data.intro_text || null,
          data.stat_siswa ?? null,
          data.stat_guru ?? null,
          data.stat_rombel ?? null,
          data.stat_prestasi ?? null,
          data.academic_badge || 'AKADEMIK & KEUNGGULAN',
          data.academic_title || 'Belajar, Berkembang, Berprestasi.',
          data.academic_media_id ? Number(data.academic_media_id) : null,
          data.academic_card_title || 'Pendidikan Karakter Holistik',
          data.academic_card_subtitle || 'Religi • Prestasi • Budi Pekerti',
          typeof data.academic_features === 'string'
            ? data.academic_features
            : JSON.stringify(data.academic_features || []),
        ],
      });

      if (Array.isArray(data.slides)) {
        const keepIds: number[] = [];
        for (let i = 0; i < data.slides.length; i++) {
          const slide = data.slides[i];
          const urutan = i + 1;
          const mediaId = slide.media_id ? Number(slide.media_id) : null;
          if (slide.id) {
            await db.execute({
              sql: `UPDATE hero_slides SET
                badge = ?,
                title = ?,
                subtitle = ?,
                primary_btn_text = ?,
                primary_btn_href = ?,
                secondary_btn_text = ?,
                secondary_btn_href = ?,
                media_id = ?,
                urutan = ?,
                status = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
              args: [
                slide.badge || null,
                slide.title || '',
                slide.subtitle || null,
                slide.primary_btn_text || 'PENDAFTARAN SPMB',
                slide.primary_btn_href || '/spmb',
                slide.secondary_btn_text || 'JELAJAHI PROFIL',
                slide.secondary_btn_href || '/profil',
                mediaId,
                urutan,
                slide.status || 'terbit',
                slide.id,
              ],
            });
            keepIds.push(Number(slide.id));
          } else {
            const insertRes = await db.execute({
              sql: `INSERT INTO hero_slides (badge, title, subtitle, primary_btn_text, primary_btn_href, secondary_btn_text, secondary_btn_href, media_id, urutan, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                slide.badge || null,
                slide.title || '',
                slide.subtitle || null,
                slide.primary_btn_text || 'PENDAFTARAN SPMB',
                slide.primary_btn_href || '/spmb',
                slide.secondary_btn_text || 'JELAJAHI PROFIL',
                slide.secondary_btn_href || '/profil',
                mediaId,
                urutan,
                slide.status || 'terbit',
              ],
            });
            if (insertRes.lastInsertRowid) {
              keepIds.push(Number(insertRes.lastInsertRowid));
            }
          }
        }

        if (keepIds.length > 0) {
          const placeholders = keepIds.map(() => '?').join(',');
          await db.execute({
            sql: `DELETE FROM hero_slides WHERE id NOT IN (${placeholders})`,
            args: keepIds,
          });
        }
      }

      await logAudit('ubah', 'Beranda', undefined, 'Memperbarui banner slide dan statistik beranda');
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } else if (type === 'contact') {
      await db.execute({
        sql: `UPDATE contact_info SET
          telepon_publik = ?,
          email_publik = ?,
          whatsapp = ?,
          instagram_url = ?,
          tiktok_url = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM contact_info LIMIT 1)`,
        args: [
          data.telepon_publik || null,
          data.email_publik || null,
          data.whatsapp || null,
          data.instagram_url || null,
          data.tiktok_url || null,
        ],
      });
      await logAudit('ubah', 'Kontak', undefined, 'Memperbarui kanal kontak dan media sosial');
    } else if (type === 'spmb') {
      await db.execute({
        sql: `UPDATE spmb_settings SET
          status_pendaftaran = ?,
          teks_pengantar = ?,
          info_pip_kip = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM spmb_settings LIMIT 1)`,
        args: [
          data.status_pendaftaran || 'ditutup',
          data.teks_pengantar || null,
          data.info_pip_kip || null,
        ],
      });
      await logAudit('ubah', 'SPMB Settings', undefined, `Memperbarui status pendaftaran menjadi ${data.status_pendaftaran}`);
    } else {
      return NextResponse.json({ success: false, message: 'Tipe pengaturan tidak dikenali' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui pengaturan' }, { status: 500 });
  }
}
