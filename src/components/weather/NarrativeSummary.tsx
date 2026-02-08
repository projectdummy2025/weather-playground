/**
 * NarrativeSummary Component - Redesigned
 * Bullet points singkat + Time Window Cards
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LightbulbIcon,
  CheckCircleIcon,
  WarningTriangleIcon,
  InfoCircleIcon,
  SunIcon,
  CloudRainIcon,
  ThermometerIcon,
  CloudIcon,
} from '@/components/ui';
import {
  generateActionItems,
  findBestActivityWindow,
  findWorstActivityWindow,
  type ActionItem,
  type TimeWindow
} from '@/services/interpreter';
import type { HourlyForecast, DailySummary } from '@/types/weather';

interface NarrativeSummaryProps {
  summary: DailySummary;
  forecasts?: HourlyForecast[];
  className?: string;
}

export const NarrativeSummary: FC<NarrativeSummaryProps> = ({
  summary,
  forecasts = [],
  className,
}) => {
  const actionItems = useMemo(() => generateActionItems(forecasts), [forecasts]);
  const bestWindow = useMemo(() => findBestActivityWindow(forecasts), [forecasts]);
  const worstWindow = useMemo(() => findWorstActivityWindow(forecasts), [forecasts]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon size={24} />
          <span>Rekomendasi Hari Ini</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action Items - Bullet Points */}
        <div className="space-y-2">
          {actionItems.map((item, index) => (
            <ActionItemRow key={index} item={item} />
          ))}
        </div>

        {/* Time Window Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bestWindow && (
            <TimeWindowCard
              type="best"
              window={bestWindow}
            />
          )}
          {worstWindow && (
            <TimeWindowCard
              type="worst"
              window={worstWindow}
            />
          )}
        </div>

        {/* Temperature Info */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <ThermometerIcon size={18} /> {summary.minTemp}° - {summary.maxTemp}°C
          </span>
          <span className="flex items-center gap-1">
            <CloudIcon size={18} /> {summary.dominantWeather}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// ActionItemRow Component
// ============================================

interface ActionItemRowProps {
  item: ActionItem;
}

const ActionItemRow: FC<ActionItemRowProps> = ({ item }) => {
  const colorClass = {
    'safe': 'text-green-700 bg-green-50',
    'warning': 'text-yellow-700 bg-yellow-50',
    'info': 'text-blue-700 bg-blue-50',
  }[item.type];

  const IconComponent = {
    'safe': CheckCircleIcon,
    'warning': WarningTriangleIcon,
    'info': InfoCircleIcon,
  }[item.type];

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg',
      colorClass
    )}>
      <IconComponent size={20} />
      <span className="text-sm font-medium">{item.text}</span>
    </div>
  );
};

// ============================================
// TimeWindowCard Component
// ============================================

interface TimeWindowCardProps {
  type: 'best' | 'worst';
  window: TimeWindow;
  className?: string;
}

const TimeWindowCard: FC<TimeWindowCardProps> = ({
  type,
  window,
  className,
}) => {
  const isBest = type === 'best';

  const formatHour = (hour: number) =>
    `${String(hour).padStart(2, '0')}:00`;

  // Format waktu: jika start dan end berbeda, tampilkan range
  const timeDisplay = window.start === window.end
    ? formatHour(window.start)
    : `${formatHour(window.start)} - ${formatHour(window.end)}`;

  return (
    <div className={cn(
      'rounded-xl border-2 p-4 text-center',
      isBest
        ? 'border-green-300 bg-green-50'
        : 'border-red-300 bg-red-50',
      className
    )}>
      <div className="flex justify-center mb-1">
        {isBest ? <SunIcon size={32} /> : <CloudRainIcon size={32} />}
      </div>
      <div className={cn(
        'text-sm font-bold',
        isBest ? 'text-green-700' : 'text-red-700'
      )}>
        {isBest ? 'WAKTU TERBAIK' : 'HINDARI'}
      </div>
      <div className={cn(
        'text-lg font-semibold mt-2',
        isBest ? 'text-green-800' : 'text-red-800'
      )}>
        {timeDisplay}
      </div>
      <div className="text-xs text-slate-500 mt-1">
        ({window.duration} jam)
      </div>
    </div>
  );
};
