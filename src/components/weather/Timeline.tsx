/**
 * Timeline Component - Simplified
 * Tampilkan data prakiraan LANGSUNG dari API tanpa penyederhanaan yang membingungkan
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { RiskLegend } from './HorizontalRiskBar';
import type { HourlyForecast, RiskLevel } from '@/types/weather';

interface TimelineProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const Timeline: FC<TimelineProps> = ({ forecasts, className }) => {
  // Urutkan dan ambil forecast yang relevan
  const sortedForecasts = useMemo(() => {
    return [...forecasts].sort((a, b) => {
      if (a.localDatetime && b.localDatetime) {
        return new Date(a.localDatetime).getTime() - new Date(b.localDatetime).getTime();
      }
      return a.hour - b.hour;
    });
  }, [forecasts]);

  if (sortedForecasts.length === 0) {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sortedForecasts.slice(0, 8).map((forecast, idx) => (
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
