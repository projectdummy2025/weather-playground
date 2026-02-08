/**
 * HorizontalRiskBar Component
 * Bar sederhana menampilkan prakiraan dari data yang tersedia
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

  // Generate rekomendasi
  const recommendation = useMemo(() => {
    if (sortedForecasts.length === 0) {
      return 'Tidak ada data prakiraan';
    }

    const hasHighRisk = sortedForecasts.some(f => f.riskLevel === 'RISIKO_TINGGI');
    const hasMediumRisk = sortedForecasts.some(f => f.riskLevel === 'RISIKO_RINGAN');
    const allSafe = sortedForecasts.every(f => f.riskLevel === 'AMAN');

    if (hasHighRisk) {
      return 'Cuaca buruk diprediksi. Hindari aktivitas luar.';
    }

    if (allSafe) {
      return 'Cuaca cerah, cocok untuk aktivitas luar.';
    }

    if (hasMediumRisk) {
      return 'Cuaca tidak stabil. Siapkan payung.';
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
            {formatHour(forecast)}
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
            title={`${formatHour(forecast)} - ${getRiskLabel(forecast.riskLevel)}`}
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

function formatHour(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    return `${String(date.getHours()).padStart(2, '0')}:00`;
  }
  return `${String(forecast.hour).padStart(2, '0')}:00`;
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

function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'AMAN':
      return 'Aman';
    case 'RISIKO_RINGAN':
      return 'Waspada';
    case 'RISIKO_TINGGI':
      return 'Hindari';
    default:
      return 'Tidak ada data';
  }
}
