import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'SDN 1 Trusmi Wetan - Sekolah Dasar Negeri Unggulan & Berkarakter';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#071933',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f59e0b',
              color: '#071933',
              fontSize: '20px',
              fontWeight: '900',
              padding: '10px 24px',
              borderRadius: '9999px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            NPSN: 20215577 • AKREDITASI A
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#ffffff',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            SDN 1 TRUSMI WETAN
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#bfdbfe',
              margin: 0,
              maxWidth: '950px',
              lineHeight: 1.4,
            }}
          >
            Membentuk Generasi Berkarakter, Cerdas, dan Berprestasi di Lingkungan Ramah Anak.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '30px',
          }}
        >
          <div style={{ fontSize: '22px', color: '#93c5fd', fontWeight: '600' }}>
            Kecamatan Plered • Kabupaten Cirebon • Jawa Barat
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#fbbf24',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Pendaftaran SPMB 2026/2027
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
