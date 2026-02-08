/**
 * NarrativeSummary Component
 * Rekomendasi sederhana dan jujur berdasarkan data
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LightbulbIcon,
  ThermometerIcon,
  CloudIcon,
} from '@/components/ui';
import type { DailySummary, HourlyForecast } from '@/types/weather';

interface NarrativeSummaryProps {
  summary: DailySummary;
  forecasts?: HourlyForecast[];
  className?: string;
}

export const NarrativeSummary: FC<NarrativeSummaryProps> = ({
  summary,
  forecasts = [],
  className,
}) => {
  // Hitung statistik sederhana
  const stats = useMemo(() => {
    if (forecasts.length === 0) {
      return { amanCount: 0, waspadaCount: 0, bahayaCount: 0, total: 0 };
    }

    const amanCount = forecasts.filter(f => f.riskLevel === 'AMAN').length;
    const waspadaCount = forecasts.filter(f => f.riskLevel === 'RISIKO_RINGAN').length;
    const bahayaCount = forecasts.filter(f => f.riskLevel === 'RISIKO_TINGGI').length;

    return { amanCount, waspadaCount, bahayaCount, total: forecasts.length };
  }, [forecasts]);

  // Generate rekomendasi JUJUR
  const recommendation = useMemo(() => {
    if (stats.total === 0) {
      return {
        type: 'info' as const,
        text: 'Data prakiraan sedang dimuat',
      };
    }

    // Jika ada bahaya
    if (stats.bahayaCount > 0) {
      return {
        type: 'danger' as const,
        text: 'Cuaca buruk diprediksi hari ini. Hindari aktivitas luar ruangan.',
      };
    }

    // Jika ada waspada tapi tidak ada aman
    if (stats.waspadaCount > 0 && stats.amanCount === 0) {
      return {
        type: 'warning' as const,
        text: 'Cuaca tidak stabil. Siapkan payung jika harus keluar.',
      };
    }

    // Jika campuran aman dan waspada
    if (stats.waspadaCount > 0 && stats.amanCount > 0) {
      return {
        type: 'warning' as const,
        text: 'Cuaca berubah-ubah. Cek prakiraan sebelum beraktivitas.',
      };
    }

    // Semua aman
    return {
      type: 'safe' as const,
      text: 'Cuaca cerah. Cocok untuk aktivitas luar ruangan.',
    };
  }, [stats]);

  const bgColor = {
    safe: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[recommendation.type];

  const textColor = {
    safe: 'text-green-800',
    warning: 'text-amber-800',
    danger: 'text-red-800',
    info: 'text-blue-800',
  }[recommendation.type];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon size={24} />
          <span>Rekomendasi</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rekomendasi utama */}
        <div className={cn('p-4 rounded-lg border', bgColor)}>
          <p className={cn('font-medium', textColor)}>
            {recommendation.text}
          </p>
        </div>

        {/* Info cuaca */}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <ThermometerIcon size={18} />
            {summary.minTemp}° - {summary.maxTemp}°C
          </span>
          <span className="flex items-center gap-1">
            <CloudIcon size={18} />
            {summary.dominantWeather}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
