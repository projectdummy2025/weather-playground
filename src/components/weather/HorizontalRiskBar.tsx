/**
 * HorizontalRiskBar Component
 * Bar sederhana dengan rekomendasi SPESIFIK
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { LightbulbIcon } from '@/components/ui';
import type { HourlyForecast, RiskLevel } from '@/types/weather';

interface HorizontalRiskBarProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const HorizontalRiskBar: FC<HorizontalRiskBarProps> = ({
  forecasts,
  className,
}) => {
  // Urutkan forecast berdasarkan waktu
  const sortedForecasts = useMemo(() => {
    return [...forecasts].sort((a, b) => {
      if (a.localDatetime && b.localDatetime) {
        return new Date(a.localDatetime).getTime() - new Date(b.localDatetime).getTime();
      }
      return a.hour - b.hour;
    });
  }, [forecasts]);

  // Generate rekomendasi SPESIFIK
  const recommendation = useMemo(() => {
    if (sortedForecasts.length === 0) {
      return 'Tidak ada data prakiraan';
    }

    const firstRisky = sortedForecasts.find(f => f.riskLevel === 'RISIKO_TINGGI');
    const firstCaution = sortedForecasts.find(f => f.riskLevel === 'RISIKO_RINGAN');
    const firstSafe = sortedForecasts.find(f => f.riskLevel === 'AMAN');
    const allSafe = sortedForecasts.every(f => f.riskLevel === 'AMAN');

    if (firstRisky) {
      return `Cuaca buruk sekitar ${formatTime(firstRisky)}. Hindari aktivitas luar.`;
    }

    if (allSafe && sortedForecasts.length > 0) {
      const first = formatTime(sortedForecasts[0]);
      const last = formatTime(sortedForecasts[sortedForecasts.length - 1]);
      return `Cuaca cerah dari ${first} sampai ${last}.`;
    }

    if (firstSafe && firstCaution) {
      return `${formatTime(firstSafe)} cerah. Waspada ${formatTime(firstCaution)}: ${firstCaution.weatherDesc}.`;
    }

    if (firstCaution) {
      return `${formatTime(firstCaution)}: ${firstCaution.weatherDesc}. Siapkan payung.`;
    }

    return 'Pantau kondisi cuaca.';
  }, [sortedForecasts]);

  if (sortedForecasts.length === 0) {
    return (
      <div className={cn('p-4 text-center text-slate-500', className)}>
        Tidak ada data prakiraan
      </div>
    );
  }

  return (
    <div className={cn('space-y-3 px-4 pb-4', className)}>
      {/* Title */}
      <h3 className="font-semibold text-slate-900 text-sm">
        PRAKIRAAN CUACA
      </h3>

      {/* Time labels */}
      <div className="flex text-xs text-slate-500">
        {sortedForecasts.map((forecast, idx) => (
          <span key={idx} className="flex-1 text-center truncate">
            {formatShortTime(forecast)}
          </span>
        ))}
      </div>

      {/* Risk bar */}
      <div className="w-full flex h-10 rounded-xl overflow-hidden shadow-inner border border-slate-200">
        {sortedForecasts.map((forecast, idx) => (
          <div
            key={idx}
            className={cn(
              'flex-1 transition-colors',
              getRiskBarColor(forecast.riskLevel)
            )}
            title={`${formatShortTime(forecast)} - ${forecast.weatherDesc}`}
          />
        ))}
      </div>

      {/* Recommendation */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <LightbulbIcon size={20} className="flex-shrink-0 mt-0.5" />
        <span>{recommendation}</span>
      </div>

      {/* Legend */}
      <RiskLegend />
    </div>
  );
};

// ============================================
// RiskLegend Component
// ============================================

export const RiskLegend: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex items-center justify-center gap-4 text-xs text-slate-600', className)}>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-green-500" />
        <span>Aman</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-yellow-500" />
        <span>Waspada</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-red-500" />
        <span>Hindari</span>
      </div>
    </div>
  );
};

// ============================================
// Helper functions
// ============================================

function formatShortTime(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    return `${String(date.getHours()).padStart(2, '0')}:00`;
  }
  return `${String(forecast.hour).padStart(2, '0')}:00`;
}

function formatTime(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    const now = new Date();
    const hour = String(date.getHours()).padStart(2, '0');

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return `jam ${hour}:00`;
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `besok ${hour}:00`;
    }

    return `${hour}:00`;
  }
  return `jam ${String(forecast.hour).padStart(2, '0')}:00`;
}

function getRiskBarColor(risk: RiskLevel): string {
  switch (risk) {
    case 'AMAN':
      return 'bg-green-500';
    case 'RISIKO_RINGAN':
      return 'bg-yellow-500';
    case 'RISIKO_TINGGI':
      return 'bg-red-500';
    default:
      return 'bg-slate-200';
  }
}
