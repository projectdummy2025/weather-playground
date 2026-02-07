/**
 * DailyForecastCard Component
 * Menampilkan ringkasan cuaca untuk satu hari
 */

import { type FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, RiskBadge } from '@/components/ui';
import { getRelativeDayLabel, formatDateShort } from '@/lib/utils';
import type { DailyForecast } from '@/types/weather';

interface DailyForecastCardProps {
  forecast: DailyForecast;
  locationCode: string;
  isToday?: boolean;
  className?: string;
}

export const DailyForecastCard: FC<DailyForecastCardProps> = ({
  forecast,
  locationCode,
  isToday = false,
  className,
}) => {
  const dayLabel = getRelativeDayLabel(forecast.date);
  const dateShort = formatDateShort(forecast.date);
  
  // Get representative hours for preview
  const previewHours = forecast.hourlyForecasts.filter(
    f => [6, 12, 18].includes(f.hour)
  );
  
  return (
    <Card 
      className={cn(
        'transition-all hover:shadow-md',
        isToday && 'ring-2 ring-blue-500',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-slate-900">{dayLabel}</div>
          <div className="text-sm text-slate-500">{dateShort}</div>
        </div>
        <RiskBadge risk={forecast.summary.overallRisk} size="sm" />
      </div>
      
      {/* Temperature range */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold text-slate-900">
          {forecast.summary.maxTemp}°
        </span>
        <span className="text-slate-400">/</span>
        <span className="text-lg text-slate-500">
          {forecast.summary.minTemp}°
        </span>
        <span className="text-sm text-slate-500 ml-2">
          {forecast.summary.dominantWeather}
        </span>
      </div>
      
      {/* Hour previews */}
      <div className="flex gap-2">
        {previewHours.map((hour, index) => (
          <HourPreview key={index} forecast={hour} />
        ))}
      </div>
    </Card>
  );
};

interface HourPreviewProps {
  forecast: DailyForecast['hourlyForecasts'][0];
}

const HourPreview: FC<HourPreviewProps> = ({ forecast }) => {
  const emoji = forecast.riskLevel === 'AMAN' ? '🟢'
    : forecast.riskLevel === 'RISIKO_RINGAN' ? '🟡'
    : '🔴';
  
  return (
    <div className="flex-1 text-center p-2 bg-slate-50 rounded-lg">
      <div className="text-xs text-slate-500">
        {String(forecast.hour).padStart(2, '0')}:00
      </div>
      <div className="text-sm mt-0.5">{emoji}</div>
      <div className="text-sm font-medium">{forecast.temperature}°</div>
    </div>
  );
};
