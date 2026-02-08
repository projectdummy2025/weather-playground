/**
 * HistoryCard Component
 * Menampilkan prakiraan kemarin + feedback dari pengguna
 * Fitur "Riwayat Prakiraan vs Realisasi"
 */

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import {
  getYesterdayForecast,
  getFeedback,
  saveFeedback,
  type StoredForecast,
  type FeedbackValue,
} from '@/lib/storage';
import { getRiskEmoji, getRiskLabel } from '@/services/interpreter';

interface HistoryCardProps {
  adm4: string;
  className?: string;
}

export function HistoryCard({ adm4, className }: HistoryCardProps) {
  const [yesterdayData, setYesterdayData] = useState<StoredForecast | null>(null);
  const [feedback, setFeedback] = useState<FeedbackValue | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = getYesterdayForecast(adm4);
    setYesterdayData(data);

    if (data) {
      const existingFeedback = getFeedback(adm4, data.date);
      setFeedback(existingFeedback);
    }
  }, [adm4]);

  // Jangan render apapun di server atau jika tidak ada data kemarin
  if (!mounted || !yesterdayData) {
    return null;
  }

  const { summary, date } = yesterdayData;
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleFeedback = (value: FeedbackValue) => {
    setFeedback(value);
    saveFeedback(adm4, date, value);
  };

  // Ringkasan jam-jam penting dari prakiraan kemarin
  const previewHours = yesterdayData.forecasts.filter(
    f => [6, 12, 18].includes(f.hour)
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span>📅</span>
          <span>Prakiraan Kemarin</span>
        </CardTitle>
        <p className="text-sm text-slate-500 mt-0.5">{formattedDate}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Prakiraan kemarin - status utama */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getRiskEmoji(summary.overallRisk)}</span>
            <span className="font-semibold text-slate-900">
              {getRiskLabel(summary.overallRisk)}
            </span>
          </div>
          {summary.narrative && (
            <p className="text-sm text-slate-600 leading-relaxed">
              &ldquo;{summary.narrative}&rdquo;
            </p>
          )}
        </div>

        {/* Preview jam-jam penting */}
        {previewHours.length > 0 && (
          <div className="flex gap-2">
            {previewHours.map((hour) => {
              const emoji =
                hour.riskLevel === 'AMAN' ? '🟢'
                : hour.riskLevel === 'RISIKO_RINGAN' ? '🟡'
                : '🔴';
              return (
                <div
                  key={hour.hour}
                  className="flex-1 text-center p-2 bg-slate-50 rounded-lg"
                >
                  <div className="text-xs text-slate-500">
                    {String(hour.hour).padStart(2, '0')}:00
                  </div>
                  <div className="text-sm mt-0.5">{emoji}</div>
                  <div className="text-sm font-medium">{hour.temperature}°</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback section */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-sm text-slate-600 mb-3">
            📝 Bagaimana kondisi sebenarnya kemarin?
          </p>
          <div className="flex gap-2">
            <FeedbackButton
              active={feedback === 'accurate'}
              onClick={() => handleFeedback('accurate')}
              variant="positive"
            >
              ✓ Sesuai
            </FeedbackButton>
            <FeedbackButton
              active={feedback === 'inaccurate'}
              onClick={() => handleFeedback('inaccurate')}
              variant="negative"
            >
              ✗ Meleset
            </FeedbackButton>
            <FeedbackButton
              active={feedback === 'unknown'}
              onClick={() => handleFeedback('unknown')}
              variant="neutral"
            >
              ? Tidak Tahu
            </FeedbackButton>
          </div>
        </div>

        {/* Thank you message */}
        {feedback && (
          <p className="text-xs text-slate-500 text-center pt-1">
            Terima kasih atas masukannya! 🙏
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// FeedbackButton Component
// ============================================

interface FeedbackButtonProps {
  active: boolean;
  onClick: () => void;
  variant: 'positive' | 'negative' | 'neutral';
  children: React.ReactNode;
}

function FeedbackButton({ active, onClick, variant, children }: FeedbackButtonProps) {
  const activeColors = {
    positive: 'bg-green-50 border-green-300 text-green-700',
    negative: 'bg-red-50 border-red-300 text-red-700',
    neutral: 'bg-blue-50 border-blue-300 text-blue-700',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 py-2.5 px-3 text-sm rounded-lg border-2 font-medium transition-colors',
        'min-h-[44px]', // Touch target
        active
          ? activeColors[variant]
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
      )}
    >
      {children}
    </button>
  );
}
