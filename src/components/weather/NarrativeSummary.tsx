/**
 * NarrativeSummary Component
 * Menampilkan ringkasan cuaca dalam bahasa awam
 */

import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, RiskBadge } from '@/components/ui';
import type { DailySummary } from '@/types/weather';

interface NarrativeSummaryProps {
  summary: DailySummary;
  className?: string;
}

export const NarrativeSummary: FC<NarrativeSummaryProps> = ({
  summary,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ringkasan Hari Ini</CardTitle>
        <RiskBadge risk={summary.overallRisk} size="sm" />
      </CardHeader>
      
      <CardContent>
        {/* Narrative text */}
        <p className="text-slate-700 leading-relaxed">
          {summary.narrative}
        </p>
        
        {/* Safe hours indicator */}
        {summary.safeHours.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <span>🟢</span>
              <span className="font-medium">Jam Aman:</span>
              <span>{formatHourRanges(summary.safeHours)}</span>
            </div>
          </div>
        )}
        
        {/* Risky hours indicator */}
        {summary.riskyHours.length > 0 && (
          <div className="mt-2 p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <span>🔴</span>
              <span className="font-medium">Perlu Waspada:</span>
              <span>{formatHourRanges(summary.riskyHours)}</span>
            </div>
          </div>
        )}
        
        {/* Temperature range */}
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span>🌡️ Suhu: {summary.minTemp}° - {summary.maxTemp}°C</span>
          <span>☁️ {summary.dominantWeather}</span>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Format array of hours into readable ranges
 * Example: [6, 7, 8, 12, 13] => "06:00-08:00, 12:00-13:00"
 */
function formatHourRanges(hours: number[]): string {
  if (hours.length === 0) return '-';
  
  const sorted = [...hours].sort((a, b) => a - b);
  const ranges: string[] = [];
  
  let start = sorted[0];
  let end = sorted[0];
  
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1 || sorted[i] === end + 3) {
      // Continue range (allowing for 3-hour gaps in BMKG data)
      end = sorted[i];
    } else {
      // End current range and start new one
      ranges.push(formatRange(start, end));
      start = sorted[i];
      end = sorted[i];
    }
  }
  
  // Add last range
  ranges.push(formatRange(start, end));
  
  return ranges.join(', ');
}

function formatRange(start: number, end: number): string {
  const startStr = String(start).padStart(2, '0') + ':00';
  const endStr = String(end).padStart(2, '0') + ':00';
  
  if (start === end) {
    return startStr;
  }
  
  return `${startStr}-${endStr}`;
}
