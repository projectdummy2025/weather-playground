/**
 * OfflineBanner Component
 * Deteksi status offline dan tampilkan banner peringatan
 */

'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setLastOnline(new Date());
    };

    const handleOnline = () => {
      setIsOffline(false);
      setLastOnline(null);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  const timeStr = lastOnline
    ? lastOnline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-yellow-500 text-yellow-950 text-sm text-center',
        'px-4 py-2 font-medium shadow-md',
        'animate-in slide-in-from-top duration-300'
      )}
      role="alert"
    >
      <span>📡 Kamu sedang offline.</span>
      {timeStr && (
        <span className="ml-1">Data terakhir dari pukul {timeStr}.</span>
      )}
    </div>
  );
}
