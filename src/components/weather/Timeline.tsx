/**
 * Timeline Component - Redesigned
 * Visual bar untuk mobile, segment cards untuk desktop
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui';
import { HorizontalRiskBar, RiskLegend } from './HorizontalRiskBar';
import { SegmentGrid } from './SegmentCard';
import { groupIntoSegments, findBestActivityWindow } from '@/services/interpreter';
import type { HourlyForecast } from '@/types/weather';

interface TimelineProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const Timeline: FC<TimelineProps> = ({ forecasts, className }) => {
  const segments = useMemo(() => groupIntoSegments(forecasts), [forecasts]);
  const bestWindow = useMemo(() => findBestActivityWindow(forecasts), [forecasts]);

  // Generate recommendation text
  const recommendation = useMemo(() => {
    if (bestWindow) {
      const start = String(bestWindow.start).padStart(2, '0');
      const end = String(bestWindow.end).padStart(2, '0');
      return `Aktivitas luar paling baik dari jam ${start}:00 - ${end}:00`;
    }
    return 'Pantau kondisi cuaca sebelum beraktivitas';
  }, [bestWindow]);

  return (
    <Card className={className}>
      {/* Mobile View */}
      <div className="md:hidden">
        <CardHeader>
          <CardTitle className="text-base">Timeline Hari Ini</CardTitle>
        </CardHeader>
        <HorizontalRiskBar forecasts={forecasts} />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <CardHeader>
          <CardTitle>Timeline Hari Ini</CardTitle>
        </CardHeader>
        
        {/* Segment Grid */}
        <SegmentGrid segments={segments} className="mb-4" />

        {/* Recommendation */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          <span>💡</span>
          <span className="font-medium">Rekomendasi:</span>
          <span>{recommendation}</span>
        </div>

        {/* Legend */}
        <RiskLegend className="mt-4" />
      </div>
    </Card>
  );
};
