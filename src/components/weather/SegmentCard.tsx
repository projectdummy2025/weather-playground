/**
 * SegmentCard Component
 * Kartu segment waktu (Pagi, Siang, Sore, Malam)
 */

import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { getRiskEmoji, getRiskLabel, type TimeSegment } from '@/services/interpreter';

interface SegmentCardProps {
  segment: TimeSegment;
  isActive?: boolean;
  className?: string;
}

export const SegmentCard: FC<SegmentCardProps> = ({
  segment,
  isActive = false,
  className,
}) => {
  const hasData = segment.hours.length > 0;
  
  const bgColor = hasData ? {
    'AMAN': 'bg-green-50 border-green-200',
    'RISIKO_RINGAN': 'bg-yellow-50 border-yellow-200',
    'RISIKO_TINGGI': 'bg-red-50 border-red-200',
  }[segment.dominantRisk] : 'bg-slate-50 border-slate-200';

  const activeBorder = hasData ? {
    'AMAN': 'ring-green-500',
    'RISIKO_RINGAN': 'ring-yellow-500',
    'RISIKO_TINGGI': 'ring-red-500',
  }[segment.dominantRisk] : 'ring-slate-400';

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 text-center transition-all',
        bgColor,
        isActive && `ring-2 ${activeBorder}`,
        className
      )}
    >
      {/* Label waktu */}
      <div className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        {segment.label}
      </div>
      
      {/* Time range */}
      <div className="text-xs text-slate-500 mt-0.5">
        {segment.timeRange}
      </div>

      {/* Risk indicator */}
      {hasData ? (
        <>
          <div className="my-3">
            <div className="text-3xl">
              {getRiskEmoji(segment.dominantRisk)}
            </div>
            <div className={cn(
              'text-sm font-bold mt-1',
              {
                'text-green-700': segment.dominantRisk === 'AMAN',
                'text-yellow-700': segment.dominantRisk === 'RISIKO_RINGAN',
                'text-red-700': segment.dominantRisk === 'RISIKO_TINGGI',
              }
            )}>
              {getRiskLabel(segment.dominantRisk).toUpperCase()}
            </div>
          </div>

          {/* Temperature & Weather */}
          <div className="text-xs text-slate-600 space-y-1">
            <div>
              {segment.tempRange.min === segment.tempRange.max 
                ? `${segment.tempRange.min}°C`
                : `${segment.tempRange.min}° - ${segment.tempRange.max}°C`
              }
            </div>
            <div className="truncate">
              {segment.dominantWeather}
            </div>
          </div>
        </>
      ) : (
        <div className="my-3">
          <div className="text-3xl text-slate-300">⏳</div>
          <div className="text-xs text-slate-400 mt-2">
            Menunggu data
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// SegmentGrid Component
// ============================================

interface SegmentGridProps {
  segments: TimeSegment[];
  className?: string;
}

export const SegmentGrid: FC<SegmentGridProps> = ({
  segments,
  className,
}) => {
  const now = new Date();
  const currentHour = now.getHours();

  // Determine which segment is active
  const getActiveSegment = () => {
    if (currentHour >= 6 && currentHour < 12) return 'Pagi';
    if (currentHour >= 12 && currentHour < 15) return 'Siang';
    if (currentHour >= 15 && currentHour < 18) return 'Sore';
    return 'Malam';
  };

  const activeSegment = getActiveSegment();

  return (
    <div className={cn('grid grid-cols-4 gap-3', className)}>
      {segments.map(segment => (
        <SegmentCard
          key={segment.label}
          segment={segment}
          isActive={segment.label === activeSegment}
        />
      ))}
    </div>
  );
};
