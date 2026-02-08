/**
 * HorizontalRiskBar Component
 * Visual bar menampilkan distribusi risiko sepanjang hari
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { HourlyForecast, RiskLevel } from '@/types/weather';

interface HorizontalRiskBarProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const HorizontalRiskBar: FC<HorizontalRiskBarProps> = ({
  forecasts,
  className,
}) => {
  const now = new Date();
  const currentHour = now.getHours();

  // Generate 24 jam (atau berdasarkan data)
  const hourlyRisks = useMemo(() => {
    const risks: (RiskLevel | null)[] = Array(24).fill(null);
    forecasts.forEach(f => {
      if (f.hour >= 0 && f.hour < 24) {
        risks[f.hour] = f.riskLevel;
      }
    });
    return risks;
  }, [forecasts]);

  // Generate rekomendasi
  const recommendation = useMemo(() => {
    const futureForecasts = forecasts.filter(f => f.hour >= currentHour && f.hour <= 18);
    const firstRisky = futureForecasts.find(f => f.riskLevel === 'RISIKO_TINGGI');
    const allSafe = futureForecasts.every(f => f.riskLevel === 'AMAN');

    if (allSafe) {
      return 'Cuaca mendukung aktivitas sepanjang hari';
    }

    if (firstRisky) {
      return `Selesaikan aktivitas luar sebelum jam ${String(firstRisky.hour).padStart(2, '0')}:00`;
    }

    return 'Pantau terus kondisi cuaca hari ini';
  }, [forecasts, currentHour]);

  // Time markers
  const timeMarkers = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <div className={cn('space-y-3', className)}>
      {/* Title */}
      <h3 className="font-semibold text-slate-900 text-sm">
        KAPAN AMAN BERAKTIVITAS?
      </h3>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-slate-500 px-0.5">
        {timeMarkers.map(hour => (
          <span key={hour} className="w-6 text-center">
            {String(hour).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Risk bar */}
      <div className="relative">
        <div className="flex h-8 rounded-lg overflow-hidden">
          {hourlyRisks.map((risk, hour) => (
            <div
              key={hour}
              className={cn(
                'flex-1 transition-colors',
                getRiskBarColor(risk)
              )}
              title={`${String(hour).padStart(2, '0')}:00 - ${getRiskTooltip(risk)}`}
            />
          ))}
        </div>

        {/* NOW indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
          style={{ left: `${(currentHour / 24) * 100}%` }}
        >
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-700">
            NOW
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <span>💡</span>
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

function getRiskBarColor(risk: RiskLevel | null): string {
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

function getRiskTooltip(risk: RiskLevel | null): string {
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
