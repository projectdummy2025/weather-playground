/**
 * HorizontalRiskBar Component
 * Visual bar menampilkan distribusi risiko sepanjang hari
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
  const now = new Date();
  const currentHour = now.getHours();

  // Generate risiko per jam dengan interpolasi untuk interval BMKG 3-jam
  const hourlyRisks = useMemo(() => {
    const risks: (RiskLevel | null)[] = Array(24).fill(null);

    // Sort forecasts by hour
    const sorted = [...forecasts].sort((a, b) => a.hour - b.hour);

    sorted.forEach((f, idx) => {
      if (f.hour >= 0 && f.hour < 24) {
        // Set current hour
        risks[f.hour] = f.riskLevel;

        // Interpolasi: extend ke jam berikutnya sampai forecast berikutnya
        const nextForecast = sorted[idx + 1];
        const endHour = nextForecast ? nextForecast.hour : Math.min(f.hour + 3, 24);

        for (let h = f.hour + 1; h < endHour && h < 24; h++) {
          risks[h] = f.riskLevel;
        }
      }
    });

    return risks;
  }, [forecasts]);

  // Generate rekomendasi
  const recommendation = useMemo(() => {
    // Filter forecast dari jam sekarang sampai malam
    const futureForecasts = forecasts
      .filter(f => f.hour >= currentHour && f.hour <= 21)
      .sort((a, b) => a.hour - b.hour);

    if (futureForecasts.length === 0) {
      return 'Tidak ada data prakiraan tersedia';
    }

    const allSafe = futureForecasts.every(f => f.riskLevel === 'AMAN');
    const firstRisky = futureForecasts.find(f => f.riskLevel === 'RISIKO_TINGGI');

    if (allSafe) {
      return 'Cuaca cerah, cocok untuk aktivitas luar ruangan';
    }

    if (firstRisky) {
      const jamRisky = String(firstRisky.hour).padStart(2, '0');
      return `Waspada cuaca buruk mulai jam ${jamRisky}:00`;
    }

    // Ada risiko ringan
    return 'Waspada perubahan cuaca, siapkan payung';
  }, [forecasts, currentHour]);

  // Time markers sesuai interval BMKG API: 02, 05, 08, 11, 14, 17, 20, 23
  const timeMarkers = [2, 5, 8, 11, 14, 17, 20, 23];

  return (
    <div className={cn('space-y-3', className)}>
      {/* Title */}
      <h3 className="font-semibold text-slate-900 text-sm">
        KAPAN AMAN BERAKTIVITAS?
      </h3>

      {/* Time labels - aligned with bar */}
      <div className="flex text-xs text-slate-500">
        {timeMarkers.map(hour => (
          <span key={hour} className="flex-1 text-center">
            {String(hour).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Risk bar - only show hours with data */}
      <div className="w-full flex h-10 md:h-12 rounded-xl overflow-hidden shadow-inner border border-slate-200">
        {timeMarkers.map(hour => (
          <div
            key={hour}
            className={cn(
              'flex-1 transition-colors',
              getRiskBarColor(hourlyRisks[hour])
            )}
            title={`${String(hour).padStart(2, '0')}:00 - ${getRiskTooltip(hourlyRisks[hour])}`}
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
