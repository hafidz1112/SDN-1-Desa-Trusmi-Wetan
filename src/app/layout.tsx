import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PublicShell from '@/components/PublicShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://sdn1trusmiwetan.sch.id'
  ),
  title: {
    default: 'SDN 1 Trusmi Wetan - Website Informasi & Profil Resmi',
    template: '%s | SDN 1 Trusmi Wetan',
  },
  description:
    'Website resmi SDN 1 Trusmi Wetan (NPSN: 20215577), Kec. Plered, Kab. Cirebon. Informasi pendaftaran peserta didik baru (SPMB 2026/2027), profil sekolah, prestasi siswa, kegiatan pembelajaran, dan sarana prasarana.',
  keywords: [
    'SDN 1 Trusmi Wetan',
    'SD Negeri 1 Trusmi Wetan',
    'SPMB SDN 1 Trusmi Wetan',
    'Sekolah Dasar Cirebon',
    'Plered Cirebon',
    'NPSN 20215577',
    'Profil Sekolah Dasar Cirebon',
  ],
  authors: [{ name: 'SDN 1 Trusmi Wetan' }],
  creator: 'SDN 1 Trusmi Wetan',
  publisher: 'SDN 1 Trusmi Wetan',
  icons: {
    icon: '/images/logo.svg',
    shortcut: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'SDN 1 Trusmi Wetan',
    title: 'SDN 1 Trusmi Wetan - Sekolah Dasar Negeri Unggulan & Berkarakter',
    description:
      'Portal resmi SDN 1 Trusmi Wetan (NPSN: 20215577), Plered, Cirebon. Informasi pendaftaran siswa baru (SPMB 2026/2027), prestasi, kegiatan, dan profil kelembagaan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SDN 1 Trusmi Wetan - Sekolah Dasar Negeri Unggulan & Berkarakter',
    description:
      'Portal resmi SDN 1 Trusmi Wetan (NPSN: 20215577), Plered, Cirebon. Informasi pendaftaran siswa baru (SPMB 2026/2027), prestasi, kegiatan, dan profil sekolah.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
