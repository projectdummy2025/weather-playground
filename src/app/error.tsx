/**
 * Error Page
 * Ditampilkan ketika terjadi error
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);
  
  return (
    <main className="px-4 py-16 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Terjadi Kesalahan
      </h1>
      <p className="text-slate-600 mb-8">
        Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={reset}>Coba Lagi</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Kembali ke Beranda
        </Button>
      </div>
    </main>
  );
}
