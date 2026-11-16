import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PublicShell from '@/components/PublicShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SDN 1 Trusmi Wetan - Website Informasi dan Profil Resmi',
  description:
    'Website resmi SDN 1 Trusmi Wetan, Kecamatan Plered, Kabupaten Cirebon. Menyajikan informasi profil sekolah, kejuaraan dan prestasi, kegiatan pembelajaran, fasilitas, serta informasi SPMB.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-[#f8fafc] text-slate-900 selection:bg-emerald-600 selection:text-white">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
