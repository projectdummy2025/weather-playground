/**
 * LocationHeader Component
 * Header yang menampilkan lokasi saat ini
 */

import { type FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { LocationInfo } from '@/types/weather';

interface LocationHeaderProps {
  location: LocationInfo;
  className?: string;
}

export const LocationHeader: FC<LocationHeaderProps> = ({
  location,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <span className="text-xl">📍</span>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {location.desa}
          </h1>
          <p className="text-sm text-slate-500">
            {location.kecamatan}, {location.kabupaten}
          </p>
        </div>
      </div>
      
      <Link
        href="/"
        className="text-sm text-blue-500 hover:text-blue-600 font-medium"
      >
        Ganti Lokasi
      </Link>
    </div>
  );
};
