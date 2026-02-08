/**
 * HorizontalRiskBar Component
 * Rolling 24-hour forecast dari sekarang ke depan
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

  // Get upcoming forecasts (from now onwards, sorted by time)
  const upcomingForecasts = useMemo(() => {
    return forecasts
      .filter(f => {
        // Include forecasts from current hour onwards
        // Handle day wrap-around by checking localDatetime if available
        return true; // We'll sort and take what we need
      })
      .sort((a, b) => {
        // Sort by localDatetime if available, otherwise by hour
        if (a.localDatetime && b.localDatetime) {
          return new Date(a.localDatetime).getTime() - new Date(b.localDatetime).getTime();
        }
        return a.hour - b.hour;
      })
      .slice(0, 8); // Take up to 8 forecasts (24 hours / 3 hour intervals)
  }, [forecasts]);

  // Generate recommendation based on upcoming forecasts
  const recommendation = useMemo(() => {
    if (upcomingForecasts.length === 0) {
      return 'Tidak ada data prakiraan tersedia';
    }

    const allSafe = upcomingForecasts.every(f => f.riskLevel === 'AMAN');
    const firstRisky = upcomingForecasts.find(f => f.riskLevel === 'RISIKO_TINGGI');
    const firstCaution = upcomingForecasts.find(f => f.riskLevel === 'RISIKO_RINGAN');

    if (allSafe) {
      return 'Cuaca cerah sepanjang hari, cocok untuk aktivitas luar ruangan';
    }

    if (firstRisky) {
      const time = formatForecastTime(firstRisky);
      return `Waspada cuaca buruk sekitar ${time}`;
    }

    if (firstCaution) {
      return 'Siapkan payung, ada kemungkinan hujan ringan';
    }

    return 'Pantau terus kondisi cuaca';
  }, [upcomingForecasts]);

  if (upcomingForecasts.length === 0) {
    return (
      <div className={cn('p-4 bg-slate-100 rounded-xl text-center text-slate-500', className)}>
        Tidak ada data prakiraan tersedia
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Title */}
      <h3 className="font-semibold text-slate-900 text-sm">
        PRAKIRAAN 24 JAM KE DEPAN
      </h3>

      {/* Time labels */}
      <div className="flex text-xs text-slate-500">
        {upcomingForecasts.map((forecast, idx) => (
          <span key={idx} className="flex-1 text-center truncate px-0.5">
            {idx === 0 ? 'Skrg' : formatShortTime(forecast)}
          </span>
        ))}
      </div>

      {/* Risk bar */}
      <div className="w-full flex h-10 md:h-12 rounded-xl overflow-hidden shadow-inner border border-slate-200">
        {upcomingForecasts.map((forecast, idx) => (
          <div
            key={idx}
            className={cn(
              'flex-1 transition-colors relative',
              getRiskBarColor(forecast.riskLevel)
            )}
            title={`${formatForecastTime(forecast)} - ${getRiskTooltip(forecast.riskLevel)}`}
          >
            {/* Current time marker */}
            {idx === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full shadow-md animate-pulse" />
              </div>
            )}
          </div>
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

function formatForecastTime(forecast: HourlyForecast): string {
  if (forecast.localDatetime) {
    const date = new Date(forecast.localDatetime);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const hour = String(date.getHours()).padStart(2, '0');
    return isToday ? `jam ${hour}:00` : `besok jam ${hour}:00`;
  }
  return `jam ${String(forecast.hour).padStart(2, '0')}:00`;
}

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

