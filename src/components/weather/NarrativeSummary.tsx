/**
 * NarrativeSummary Component
 * Narasi persuasif dengan logika jam aktivitas yang masuk akal
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

// Jam aktivitas normal (06:00 - 22:00)
const ACTIVITY_START_HOUR = 6;
const ACTIVITY_END_HOUR = 22;

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

    // FILTER: Hanya jam aktivitas (06:00 - 22:00)
    const activityHours = sorted.filter(f => {
      const hour = f.localDatetime ? new Date(f.localDatetime).getHours() : f.hour;
      return hour >= ACTIVITY_START_HOUR && hour < ACTIVITY_END_HOUR;
    });

    // Jika tidak ada data jam aktivitas, cek jam sekarang
    const now = new Date();
    const currentHour = now.getHours();

    // Kalau sudah malam (setelah jam 22), kasih info untuk besok
    if (activityHours.length === 0 && currentHour >= ACTIVITY_END_HOUR) {
      // Cari forecast besok jam aktivitas
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tomorrowForecasts = sorted.filter(f => {
        if (!f.localDatetime) return false;
        const date = new Date(f.localDatetime);
        const hour = date.getHours();
        return date.toDateString() === tomorrow.toDateString() &&
          hour >= ACTIVITY_START_HOUR && hour < ACTIVITY_END_HOUR;
      });

      if (tomorrowForecasts.length > 0) {
        const hasBadWeather = tomorrowForecasts.some(f => f.riskLevel === 'RISIKO_TINGGI');
        const hasCaution = tomorrowForecasts.some(f => f.riskLevel === 'RISIKO_RINGAN');

        if (hasBadWeather) {
          return {
            type: 'danger' as const,
            text: `Besok diprediksi ada cuaca buruk. Rencanakan aktivitasmu dengan hati-hati ya. Pantau terus updatenya!`,
          };
        } else if (hasCaution) {
          return {
            type: 'warning' as const,
            text: `Besok cuaca agak tidak stabil. Siapkan payung untuk jaga-jaga! ☔`,
          };
        } else {
          return {
            type: 'safe' as const,
            text: `Besok cuaca cerah! Tidur yang nyenyak, besok cocok untuk aktivitas luar. 🌤️`,
          };
        }
      }

      return {
        type: 'info' as const,
        text: 'Sudah malam, istirahat dulu ya. Besok cek lagi prakiraan cuacanya!',
      };
    }

    // Kalau belum jam aktivitas (sebelum jam 6 pagi)
    if (activityHours.length === 0 && currentHour < ACTIVITY_START_HOUR) {
      return {
        type: 'info' as const,
        text: 'Masih pagi buta nih. Tidur dulu, nanti jam 6 cek lagi ya!',
      };
    }

    // Analisis kondisi untuk jam aktivitas
    const riskyForecasts = activityHours.filter(f => f.riskLevel === 'RISIKO_TINGGI');
    const cautionForecasts = activityHours.filter(f => f.riskLevel === 'RISIKO_RINGAN');
    const safeForecasts = activityHours.filter(f => f.riskLevel === 'AMAN');

    // === NARASI UNTUK BERBAGAI KONDISI ===

    // Kalau ada cuaca buruk di jam aktivitas
    if (riskyForecasts.length > 0) {
      const time = formatTimeNatural(riskyForecasts[0]);
      const weather = riskyForecasts[0].weatherDesc.toLowerCase();
      return {
        type: 'danger' as const,
        text: `Hati-hati! ${time} diprediksi ada ${weather}. Kalau bisa, tunda dulu aktivitas di luar atau pastikan kamu sudah di tempat yang aman sebelumnya.`,
      };
    }

    // Kalau semua jam aktivitas aman
    if (cautionForecasts.length === 0 && safeForecasts.length > 0) {
      return {
        type: 'safe' as const,
        text: `Kabar baik! Cuaca ${summary.dominantWeather.toLowerCase()} dengan suhu ${summary.minTemp}°-${summary.maxTemp}°C. Aman untuk beraktivitas di luar. Selamat beraktivitas! 🌤️`,
      };
    }

    // Kalau ada campuran aman dan waspada
    if (safeForecasts.length > 0 && cautionForecasts.length > 0) {
      const safeTime = formatTimeNatural(safeForecasts[0]);
      const cautionTime = formatTimeNatural(cautionForecasts[0]);
      const weather = cautionForecasts[0].weatherDesc.toLowerCase();

      return {
        type: 'warning' as const,
        text: `${safeTime} cuaca masih mendukung untuk keluar. Tapi ${cautionTime} ada kemungkinan ${weather}, jadi bawa payung untuk jaga-jaga ya! ☔`,
      };
    }

    // Kalau semua jam aktivitas waspada
    if (cautionForecasts.length > 0) {
      const weather = cautionForecasts[0].weatherDesc.toLowerCase();
      return {
        type: 'warning' as const,
        text: `Hari ini cuaca cenderung ${weather}. Kalau harus keluar, siapkan payung dan pilih waktu yang tepat ya!`,
      };
    }

    return {
      type: 'info' as const,
      text: 'Cuaca hari ini dinamis. Pantau terus prakiraan untuk update terbaru.',
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

    // Konteks waktu yang lebih natural
    let timeContext = '';
    if (hour >= 6 && hour < 10) timeContext = 'pagi ini';
    else if (hour >= 10 && hour < 12) timeContext = 'menjelang siang';
    else if (hour >= 12 && hour < 15) timeContext = 'siang ini';
    else if (hour >= 15 && hour < 18) timeContext = 'sore ini';
    else if (hour >= 18 && hour < 22) timeContext = 'malam ini';
    else timeContext = 'nanti';

    if (isToday) {
      return timeContext;
    } else if (isTomorrow) {
      if (hour >= 6 && hour < 12) return 'besok pagi';
      if (hour >= 12 && hour < 18) return 'besok siang';
      return 'besok malam';
    }

    return `jam ${String(hour).padStart(2, '0')}:00`;
  }

  return `jam ${String(forecast.hour).padStart(2, '0')}:00`;
}
