/**
 * NarrativeSummary Component
 * Rekomendasi yang KONSISTEN dengan data yang ditampilkan
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
  // Generate rekomendasi berdasarkan data
  const recommendation = useMemo(() => {
    if (forecasts.length === 0) {
      return {
        type: 'info' as const,
        text: 'Data prakiraan sedang dimuat...',
      };
    }

    // Urutkan
    const sorted = [...forecasts].sort((a, b) => {
      if (a.localDatetime && b.localDatetime) {
        return new Date(a.localDatetime).getTime() - new Date(b.localDatetime).getTime();
      }
      return a.hour - b.hour;
    });

    // Analisis
    const riskyForecasts = sorted.filter(f => f.riskLevel === 'RISIKO_TINGGI');
    const cautionForecasts = sorted.filter(f => f.riskLevel === 'RISIKO_RINGAN');
    const safeForecasts = sorted.filter(f => f.riskLevel === 'AMAN');

    // Jika ada risiko tinggi
    if (riskyForecasts.length > 0) {
      const times = riskyForecasts.map(f => formatTime(f)).join(', ');
      const weather = riskyForecasts[0].weatherDesc;
      return {
        type: 'danger' as const,
        text: `Hindari keluar ${times}: ${weather}`,
      };
    }

    // Jika semua aman
    if (cautionForecasts.length === 0 && safeForecasts.length > 0) {
      return {
        type: 'safe' as const,
        text: `Cuaca cerah, cocok untuk aktivitas luar.`,
      };
    }

    // Jika ada waspada
    if (cautionForecasts.length > 0) {
      const times = cautionForecasts.map(f => formatTime(f)).join(', ');
      const weather = cautionForecasts[0].weatherDesc;

      if (safeForecasts.length > 0) {
        const safeTimes = safeForecasts.map(f => formatTime(f)).join(', ');
        return {
          type: 'warning' as const,
          text: `Keluar di ${safeTimes} (cerah). Waspada ${times}: ${weather}.`,
        };
      }

      return {
        type: 'warning' as const,
        text: `Waspada ${times}: ${weather}. Siapkan payung.`,
      };
    }

    return {
      type: 'info' as const,
      text: 'Pantau kondisi cuaca.',
    };
  }, [forecasts]);

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
        {/* Rekomendasi */}
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

function formatTime(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    const now = new Date();
    const hour = `${String(date.getHours()).padStart(2, '0')}:00`;

    if (date.toDateString() === now.toDateString()) {
      return hour;
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `besok ${hour}`;
    }

    return hour;
  }
  return `${String(forecast.hour).padStart(2, '0')}:00`;
}
