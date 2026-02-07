import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Cumulus - Prakiraan Cuaca Indonesia',
  description: 'Aplikasi prakiraan cuaca Indonesia berbasis BMKG yang fokus pada pengambilan keputusan praktis. Ketahui kapan aman dan kapan berisiko untuk beraktivitas.',
  keywords: ['cuaca', 'prakiraan cuaca', 'BMKG', 'Indonesia', 'hujan', 'cuaca hari ini'],
  authors: [{ name: 'Cumulus Team' }],
  openGraph: {
    title: 'Cumulus - Prakiraan Cuaca Indonesia',
    description: 'Ketahui kapan aman dan kapan berisiko untuk beraktivitas',
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <div className="max-w-lg mx-auto">
          {children}
        </div>
        
        {/* BMKG Attribution */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-4">
          <p className="text-center text-xs text-slate-500">
            Data prakiraan cuaca disediakan oleh{' '}
            <a 
              href="https://www.bmkg.go.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              BMKG
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
