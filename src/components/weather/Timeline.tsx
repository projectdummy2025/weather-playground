/**
 * Timeline Component
 * Menampilkan timeline cuaca per jam dengan warna risiko
 */

'use client';

import { type FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, RiskBadge } from '@/components/ui';
import type { HourlyForecast, RiskLevel } from '@/types/weather';

interface TimelineProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const Timeline: FC<TimelineProps> = ({ forecasts, className }) => {
  const [selectedHour, setSelectedHour] = useState<HourlyForecast | null>(null);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Timeline Cuaca</CardTitle>
      </CardHeader>
      
      {/* Horizontal scrolling timeline */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {forecasts.map((forecast, index) => (
            <TimelineSlot
              key={index}
              forecast={forecast}
              isSelected={selectedHour?.hour === forecast.hour}
              onClick={() => setSelectedHour(forecast)}
            />
          ))}
        </div>
      </div>
      
      {/* Selected hour detail */}
      {selectedHour && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <TimelineDetail forecast={selectedHour} />
        </div>
      )}
    </Card>
  );
};

interface TimelineSlotProps {
  forecast: HourlyForecast;
  isSelected: boolean;
  onClick: () => void;
}

const TimelineSlot: FC<TimelineSlotProps> = ({
  forecast,
  isSelected,
  onClick,
}) => {
  const bgColor = getRiskBgColor(forecast.riskLevel);
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center p-2 rounded-lg transition-all min-w-[60px]',
        bgColor,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      <span className="text-xs font-medium text-slate-600">
        {String(forecast.hour).padStart(2, '0')}:00
      </span>
      <span className="text-xl my-1">
        {getRiskEmoji(forecast.riskLevel)}
      </span>
      <span className="text-sm font-semibold">
        {forecast.temperature}°
      </span>
    </button>
  );
};

interface TimelineDetailProps {
  forecast: HourlyForecast;
}

const TimelineDetail: FC<TimelineDetailProps> = ({ forecast }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">
          {String(forecast.hour).padStart(2, '0')}:00
        </div>
        <div className="text-slate-600">{forecast.weatherDesc}</div>
        <div className="text-sm text-slate-500 mt-1">
          {forecast.temperature}°C • Kelembapan {forecast.humidity}%
        </div>
      </div>
      <RiskBadge risk={forecast.riskLevel} />
    </div>
  );
};

function getRiskBgColor(risk: RiskLevel): string {
  switch (risk) {
    case 'AMAN':
      return 'bg-green-50 hover:bg-green-100';
    case 'RISIKO_RINGAN':
      return 'bg-yellow-50 hover:bg-yellow-100';
    case 'RISIKO_TINGGI':
      return 'bg-red-50 hover:bg-red-100';
    default:
      return 'bg-slate-50 hover:bg-slate-100';
  }
}

function getRiskEmoji(risk: RiskLevel): string {
  switch (risk) {
    case 'AMAN':
      return '🟢';
    case 'RISIKO_RINGAN':
      return '🟡';
    case 'RISIKO_TINGGI':
      return '🔴';
    default:
      return '⚪';
  }
}
