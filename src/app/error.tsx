/**
 * Error Page
 * Ditampilkan ketika terjadi error — pesan ramah + retry
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
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Terjadi Kesalahan
        </h1>
        <p className="text-slate-600 mb-2">
          Gagal memuat data cuaca. Silakan coba lagi.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-6 font-mono">
            Kode: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>
            🔄 Coba Lagi
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </main>
  );
}
