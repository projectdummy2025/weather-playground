/**
 * Timeline Component
 * Tampilkan prakiraan HANYA jam aktivitas (06:00-21:00)
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { RiskLegend } from './HorizontalRiskBar';
import type { HourlyForecast } from '@/types/weather';

// Jam aktivitas normal (06:00 - 21:00)
const ACTIVITY_START_HOUR = 6;
const ACTIVITY_END_HOUR = 21;

interface TimelineProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const Timeline: FC<TimelineProps> = ({ forecasts, className }) => {
  // Filter dan urutkan forecast - HANYA jam aktivitas
  const displayForecasts = useMemo(() => {
    // Urutkan berdasarkan waktu
    const sorted = [...forecasts].sort((a, b) => {
      if (a.localDatetime && b.localDatetime) {
        return new Date(a.localDatetime).getTime() - new Date(b.localDatetime).getTime();
      }
      return a.hour - b.hour;
    });

    // FILTER KETAT: hanya jam 06:00 - 21:00 (aktivitas normal)
    const activityOnly = sorted.filter(f => {
      const hour = f.localDatetime ? new Date(f.localDatetime).getHours() : f.hour;
      return hour >= ACTIVITY_START_HOUR && hour <= ACTIVITY_END_HOUR;
    });

    // Jika ada data jam aktivitas, tampilkan
    if (activityOnly.length > 0) {
      return activityOnly.slice(0, 6);
    }

    // Jika tidak ada jam aktivitas sama sekali, cari forecast besok pagi
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowMorning = sorted.filter(f => {
      if (!f.localDatetime) return false;
      const date = new Date(f.localDatetime);
      const hour = date.getHours();
      return date.toDateString() === tomorrow.toDateString() &&
        hour >= 6 && hour <= 12;
    });

    if (tomorrowMorning.length > 0) {
      return tomorrowMorning.slice(0, 6);
    }

    // Fallback terakhir: jika benar-benar tidak ada, jangan tampilkan apapun
    return [];
  }, [forecasts]);

  if (displayForecasts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Prakiraan Cuaca</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-4">
            Data prakiraan untuk jam aktivitas belum tersedia.
            <br />
            <span className="text-sm">Cek lagi besok pagi!</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Prakiraan Cuaca</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Forecast Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {displayForecasts.map((forecast, idx) => (
            <ForecastCard key={idx} forecast={forecast} />
          ))}
        </div>

        {/* Legend */}
        <RiskLegend className="pt-2" />
      </CardContent>
    </Card>
  );
};

// ============================================
// ForecastCard Component
// ============================================

interface ForecastCardProps {
  forecast: HourlyForecast;
}

const ForecastCard: FC<ForecastCardProps> = ({ forecast }) => {
  const time = formatTime(forecast);
  const dayLabel = getDayLabel(forecast);

  const bgColor = {
    'AMAN': 'bg-green-50 border-green-300',
    'RISIKO_RINGAN': 'bg-amber-50 border-amber-300',
    'RISIKO_TINGGI': 'bg-red-50 border-red-300',
  }[forecast.riskLevel] || 'bg-slate-50 border-slate-200';

  const statusColor = {
    'AMAN': 'text-green-700',
    'RISIKO_RINGAN': 'text-amber-700',
    'RISIKO_TINGGI': 'text-red-700',
  }[forecast.riskLevel] || 'text-slate-700';

  const statusLabel = {
    'AMAN': 'Aman',
    'RISIKO_RINGAN': 'Waspada',
    'RISIKO_TINGGI': 'Hindari',
  }[forecast.riskLevel] || '-';

  return (
    <div className={cn('rounded-lg border p-3 text-center', bgColor)}>
      {/* Time */}
      <div className="text-xs text-slate-500">{dayLabel}</div>
      <div className="font-bold text-slate-900">{time}</div>

      {/* Status */}
      <div className={cn('text-sm font-semibold mt-1', statusColor)}>
        {statusLabel}
      </div>

      {/* Weather & Temp */}
      <div className="text-xs text-slate-600 mt-1">
        {forecast.temperature}°C
      </div>
      <div className="text-xs text-slate-500 truncate">
        {forecast.weatherDesc}
      </div>
    </div>
  );
};

// ============================================
// Helper functions
// ============================================

function formatTime(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    return `${String(date.getHours()).padStart(2, '0')}:00`;
  }
  return `${String(forecast.hour).padStart(2, '0')}:00`;
}

function getDayLabel(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return 'Hari ini';
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Besok';
    }

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[date.getDay()];
  }
  return '';
}
