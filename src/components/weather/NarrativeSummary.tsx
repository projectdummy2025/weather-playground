/**
 * NarrativeSummary Component
 * Narasi persuasif seperti teman yang kasih saran cuaca
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
  // Generate narasi persuasif
  const narrative = useMemo(() => {
    if (forecasts.length === 0) {
      return {
        type: 'info' as const,
        text: 'Sebentar ya, lagi ambil data cuaca terbaru...',
      };
    }

    // Urutkan berdasarkan waktu
    const sorted = [...forecasts].sort((a, b) => {
      if (a.localDatetime && b.localDatetime) {
        return new Date(a.localDatetime).getTime() - new Date(b.localDatetime).getTime();
      }
      return a.hour - b.hour;
    });

    // Analisis kondisi
    const riskyForecasts = sorted.filter(f => f.riskLevel === 'RISIKO_TINGGI');
    const cautionForecasts = sorted.filter(f => f.riskLevel === 'RISIKO_RINGAN');
    const safeForecasts = sorted.filter(f => f.riskLevel === 'AMAN');

    // === NARASI UNTUK BERBAGAI KONDISI ===

    // Kalau ada cuaca buruk
    if (riskyForecasts.length > 0) {
      const time = formatTimeNatural(riskyForecasts[0]);
      const weather = riskyForecasts[0].weatherDesc.toLowerCase();
      return {
        type: 'danger' as const,
        text: `Wah, ${time} diprediksi ada ${weather}. Sebaiknya tunda dulu aktivitas di luar ya, atau pastikan kamu sudah di tempat yang aman sebelumnya.`,
      };
    }

    // Kalau semua aman
    if (cautionForecasts.length === 0 && safeForecasts.length > 0) {
      const temp = Math.round((summary.minTemp + summary.maxTemp) / 2);
      return {
        type: 'safe' as const,
        text: `Kabar baik! Cuaca ${summary.dominantWeather.toLowerCase()} dengan suhu sekitar ${temp}°C. Cocok banget buat aktivitas di luar. Selamat beraktivitas! 🌤️`,
      };
    }

    // Kalau ada campuran aman dan waspada
    if (safeForecasts.length > 0 && cautionForecasts.length > 0) {
      const safeTime = formatTimeNatural(safeForecasts[0]);
      const cautionTime = formatTimeNatural(cautionForecasts[0]);
      const weather = cautionForecasts[0].weatherDesc.toLowerCase();

      return {
        type: 'warning' as const,
        text: `${safeTime} cuaca masih mendukung untuk keluar. Tapi ${cautionTime} ada kemungkinan ${weather}, jadi bawa payung atau jas hujan untuk jaga-jaga ya! ☔`,
      };
    }

    // Kalau semua waspada
    if (cautionForecasts.length > 0) {
      const weather = cautionForecasts[0].weatherDesc.toLowerCase();
      return {
        type: 'warning' as const,
        text: `Cuaca hari ini cenderung ${weather}. Kalau harus keluar, siapkan payung dan pilih waktu yang tepat. Pantau terus updatenya ya!`,
      };
    }

    return {
      type: 'info' as const,
      text: 'Cuaca hari ini cukup dinamis. Pantau terus prakiraan untuk update terbaru.',
    };
  }, [forecasts, summary]);

  const bgColor = {
    safe: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[narrative.type];

  const textColor = {
    safe: 'text-green-800',
    warning: 'text-amber-800',
    danger: 'text-red-800',
    info: 'text-blue-800',
  }[narrative.type];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon size={24} />
          <span>Saran Hari Ini</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Narasi utama */}
        <div className={cn('p-4 rounded-lg border', bgColor)}>
          <p className={cn('leading-relaxed', textColor)}>
            {narrative.text}
          </p>
        </div>

        {/* Info ringkas */}
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

// Format waktu dengan bahasa natural
function formatTimeNatural(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    const now = new Date();
    const hour = date.getHours();

    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    // Konteks waktu
    let timeContext = '';
    if (hour >= 5 && hour < 10) timeContext = 'pagi';
    else if (hour >= 10 && hour < 15) timeContext = 'siang';
    else if (hour >= 15 && hour < 18) timeContext = 'sore';
    else if (hour >= 18 && hour < 22) timeContext = 'malam';
    else timeContext = 'dini hari';

    const hourStr = `${String(hour).padStart(2, '0')}:00`;

    if (isToday) {
      if (hour >= 18) return `nanti malam sekitar jam ${hourStr}`;
      return `hari ini ${timeContext} (${hourStr})`;
    } else if (isTomorrow) {
      return `besok ${timeContext} (${hourStr})`;
    }

    return `jam ${hourStr}`;
  }

  return `jam ${String(forecast.hour).padStart(2, '0')}:00`;
}
