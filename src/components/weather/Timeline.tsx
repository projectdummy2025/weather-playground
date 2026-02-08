/**
 * Timeline Component
 * Tampilkan prakiraan dengan prioritas jam aktivitas
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { RiskLegend } from './HorizontalRiskBar';
import type { HourlyForecast, RiskLevel } from '@/types/weather';

// Jam aktivitas normal
const ACTIVITY_START_HOUR = 6;
const ACTIVITY_END_HOUR = 22;

interface TimelineProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const Timeline: FC<TimelineProps> = ({ forecasts, className }) => {
  // Filter dan urutkan forecast
  const displayForecasts = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();

    // Urutkan berdasarkan waktu
    const sorted = [...forecasts].sort((a, b) => {
      if (a.localDatetime && b.localDatetime) {
        return new Date(a.localDatetime).getTime() - new Date(b.localDatetime).getTime();
      }
      return a.hour - b.hour;
    });

    // Jika malam (setelah jam 22), tampilkan forecast besok jam aktivitas
    if (currentHour >= ACTIVITY_END_HOUR) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Cari forecast besok di jam aktivitas
      const tomorrowActive = sorted.filter(f => {
        if (!f.localDatetime) return false;
        const date = new Date(f.localDatetime);
        const hour = date.getHours();
        return date.toDateString() === tomorrow.toDateString() &&
          hour >= ACTIVITY_START_HOUR && hour < ACTIVITY_END_HOUR;
      });

      if (tomorrowActive.length > 0) {
        return tomorrowActive.slice(0, 6);
      }
    }

    // Jika pagi buta (sebelum jam 6)
    if (currentHour < ACTIVITY_START_HOUR) {
      // Cari forecast hari ini jam aktivitas
      const todayActive = sorted.filter(f => {
        if (!f.localDatetime) return false;
        const date = new Date(f.localDatetime);
        const hour = date.getHours();
        return date.toDateString() === now.toDateString() &&
          hour >= ACTIVITY_START_HOUR && hour < ACTIVITY_END_HOUR;
      });

      if (todayActive.length > 0) {
        return todayActive.slice(0, 6);
      }
    }

    // Default: ambil forecast yang ada, prioritaskan jam aktivitas
    const activeHours = sorted.filter(f => {
      const hour = f.localDatetime ? new Date(f.localDatetime).getHours() : f.hour;
      return hour >= ACTIVITY_START_HOUR && hour < ACTIVITY_END_HOUR;
    });

    if (activeHours.length >= 4) {
      return activeHours.slice(0, 6);
    }

    // Fallback: tampilkan apa yang ada
    return sorted.slice(0, 6);
  }, [forecasts]);

  if (displayForecasts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Prakiraan Cuaca</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-4">Memuat data prakiraan...</p>
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
