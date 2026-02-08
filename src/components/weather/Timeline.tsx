/**
 * Timeline Component
 * Visual bar untuk mobile, segment cards untuk desktop
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui';
import { HorizontalRiskBar, RiskLegend } from './HorizontalRiskBar';
import { SegmentGrid } from './SegmentCard';
import { groupIntoSegments } from '@/services/interpreter';
import type { HourlyForecast } from '@/types/weather';

interface TimelineProps {
  forecasts: HourlyForecast[];
  className?: string;
}

export const Timeline: FC<TimelineProps> = ({ forecasts, className }) => {
  const segments = useMemo(() => groupIntoSegments(forecasts), [forecasts]);

  // Generate rekomendasi JUJUR berdasarkan data
  const recommendation = useMemo(() => {
    if (forecasts.length === 0) {
      return 'Sedang memuat data prakiraan...';
    }

    const hasHighRisk = forecasts.some(f => f.riskLevel === 'RISIKO_TINGGI');
    const hasMediumRisk = forecasts.some(f => f.riskLevel === 'RISIKO_RINGAN');
    const allSafe = forecasts.every(f => f.riskLevel === 'AMAN');

    if (hasHighRisk) {
      return 'Cuaca buruk diprediksi. Hindari aktivitas luar.';
    }

    if (hasMediumRisk && !allSafe) {
      return 'Cuaca berubah-ubah. Siapkan payung jika keluar.';
    }

    if (allSafe) {
      return 'Cuaca cerah sepanjang hari.';
    }

    return 'Pantau kondisi cuaca sebelum beraktivitas.';
  }, [forecasts]);

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
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
          <span>💡</span>
          <span>{recommendation}</span>
        </div>

        {/* Legend */}
        <RiskLegend className="mt-4" />
      </div>
    </Card>
  );
};
