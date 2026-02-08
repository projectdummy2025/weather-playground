/**
 * Skeleton Components
 * Skeleton loading states untuk WeatherCard, Timeline, dan NarrativeSummary
 */

import { cn } from '@/lib/utils';
import { Card, CardHeader } from './Card';

// ============================================
// Base Skeleton
// ============================================

interface SkeletonBoxProps {
  className?: string;
}

export function SkeletonBox({ className }: SkeletonBoxProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200',
        className
      )}
    />
  );
}

// ============================================
// WeatherCard Skeleton
// ============================================

export function WeatherCardSkeleton({ className }: { className?: string }) {
  return (
    <Card variant="elevated" className={cn('relative overflow-hidden p-0', className)}>
      <div className="p-4">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Weather Info */}
          <div className="flex items-center justify-center gap-4">
            <SkeletonBox className="w-16 h-16 rounded-full" />
            <div className="text-center space-y-2">
              <SkeletonBox className="h-10 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
          </div>

          {/* Status Box */}
          <SkeletonBox className="h-[120px] rounded-xl" />

          {/* Location */}
          <div className="flex justify-center">
            <SkeletonBox className="h-4 w-40" />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {/* Left: Weather */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-4">
              <SkeletonBox className="w-20 h-20 rounded-full" />
              <div className="space-y-2">
                <SkeletonBox className="h-12 w-32" />
                <SkeletonBox className="h-4 w-24" />
              </div>
            </div>
            <SkeletonBox className="h-4 w-48" />
          </div>

          {/* Right: Status Box */}
          <SkeletonBox className="h-[120px] rounded-xl" />
        </div>
      </div>
    </Card>
  );
}

// ============================================
// Timeline Skeleton
// ============================================

export function TimelineSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      {/* Mobile View */}
      <div className="md:hidden">
        <CardHeader>
          <SkeletonBox className="h-5 w-36" />
        </CardHeader>
        <div className="space-y-3">
          <SkeletonBox className="h-4 w-48" />
          {/* Time markers */}
          <div className="flex justify-between px-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonBox key={i} className="h-3 w-6" />
            ))}
          </div>
          {/* Bar */}
          <SkeletonBox className="h-8 w-full rounded-lg" />
          {/* Recommendation */}
          <SkeletonBox className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <CardHeader>
          <SkeletonBox className="h-6 w-40" />
        </CardHeader>
        {/* Segment Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-36 rounded-xl" />
          ))}
        </div>
        {/* Recommendation */}
        <SkeletonBox className="h-10 w-full rounded-lg" />
      </div>
    </Card>
  );
}

// ============================================
// NarrativeSummary Skeleton
// ============================================

export function NarrativeSummarySkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <SkeletonBox className="h-6 w-48" />
      </CardHeader>
      <div className="space-y-4">
        {/* Action Items */}
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>

        {/* Time Window Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SkeletonBox className="h-28 rounded-xl" />
          <SkeletonBox className="h-28 rounded-xl" />
        </div>

        {/* Temperature Info */}
        <div className="pt-3 border-t border-slate-100 flex gap-4">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );
}

// ============================================
// DailyForecastCard Skeleton
// ============================================

export function DailyForecastCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-1">
          <SkeletonBox className="h-5 w-16" />
          <SkeletonBox className="h-3 w-12" />
        </div>
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>

      {/* Temperature */}
      <div className="flex items-center gap-2 mb-3">
        <SkeletonBox className="h-7 w-12" />
        <SkeletonBox className="h-5 w-8" />
        <SkeletonBox className="h-4 w-20 ml-2" />
      </div>

      {/* Hour previews */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} className="flex-1 h-16 rounded-lg" />
        ))}
      </div>
    </Card>
  );
}

// ============================================
// Full Page Skeleton (Weather Page)
// ============================================

export function WeatherPageSkeleton() {
  return (
    <div className="px-4 py-4 pb-16 max-w-5xl mx-auto">
      {/* Location Header */}
      <div className="space-y-1">
        <SkeletonBox className="h-7 w-48" />
        <SkeletonBox className="h-4 w-64" />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4 mt-4">
        <WeatherCardSkeleton />
        <TimelineSkeleton />
        <NarrativeSummarySkeleton />
        {Array.from({ length: 2 }).map((_, i) => (
          <DailyForecastCardSkeleton key={i} />
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block space-y-6 mt-4">
        <div className="grid grid-cols-2 gap-6">
          <WeatherCardSkeleton />
          <TimelineSkeleton />
        </div>
        <NarrativeSummarySkeleton />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <DailyForecastCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
