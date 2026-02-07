/**
 * Not Found Page
 * Ditampilkan ketika halaman tidak ditemukan
 */

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="px-4 py-16 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-slate-600 mb-8">
        Lokasi yang kamu cari tidak tersedia atau URL tidak valid.
      </p>
      <Link href="/">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </main>
  );
}
