/**
 * WeatherCard Component - Redesigned
 * Status risiko prominent, glanceable dalam 5 detik
 */

'use client';

import { type FC } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui';
import type { HourlyForecast, LocationInfo } from '@/types/weather';
import { 
  getNextRiskChange, 
  getRiskLabel, 
  getRiskEmoji,
  type RiskChangeInfo 
} from '@/services/interpreter';

interface WeatherCardProps {
  location: LocationInfo;
  currentWeather: HourlyForecast;
  forecasts?: HourlyForecast[];
  className?: string;
}

export const WeatherCard: FC<WeatherCardProps> = ({
  location,
  currentWeather,
  forecasts = [],
  className,
}) => {
  const riskChange = getNextRiskChange(forecasts);

  return (
    <Card 
      variant="elevated" 
      className={cn(
        'relative overflow-hidden p-0',
        className
      )}
    >
      {/* Background gradient based on risk */}
      <div className={cn(
        'absolute inset-0 opacity-10',
        {
          'bg-gradient-to-br from-green-400 to-green-600': currentWeather.riskLevel === 'AMAN',
          'bg-gradient-to-br from-yellow-400 to-orange-500': currentWeather.riskLevel === 'RISIKO_RINGAN',
          'bg-gradient-to-br from-red-400 to-red-600': currentWeather.riskLevel === 'RISIKO_TINGGI',
        }
      )} />

      <div className="relative p-4">
        {/* Mobile Layout: Stacked */}
        <div className="md:hidden space-y-4">
          {/* Weather Info */}
          <div className="flex items-center justify-center gap-4">
            {/* Weather Icon */}
            <div className="relative w-16 h-16">
              {currentWeather.imageUrl ? (
                <Image
                  src={currentWeather.imageUrl}
                  alt={currentWeather.weatherDesc}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🌤️
                </div>
              )}
            </div>
            
            {/* Temperature */}
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">
                {currentWeather.temperature}°C
              </div>
              <div className="text-slate-600 text-sm">
                {currentWeather.weatherDesc}
              </div>
            </div>
          </div>

          {/* Status Box - PROMINENT */}
          <StatusBox 
            risk={currentWeather.riskLevel} 
            riskChange={riskChange}
          />

          {/* Location */}
          <div className="text-center text-slate-600">
            <span className="text-lg mr-1">📍</span>
            {location.desa}, {location.kecamatan}
          </div>
        </div>

        {/* Desktop Layout: Side by Side */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {/* Left: Weather Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4">
              {/* Weather Icon */}
              <div className="relative w-20 h-20">
                {currentWeather.imageUrl ? (
                  <Image
                    src={currentWeather.imageUrl}
                    alt={currentWeather.weatherDesc}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    🌤️
                  </div>
                )}
              </div>
              
              {/* Temperature */}
              <div>
                <div className="text-5xl font-bold text-slate-900">
                  {currentWeather.temperature}°C
                </div>
                <div className="text-slate-600">
                  {currentWeather.weatherDesc}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-4 text-slate-600">
              <span className="text-lg mr-1">📍</span>
              {location.desa}, {location.kecamatan}
              <span className="text-slate-400 ml-1">• {location.kabupaten}</span>
            </div>
          </div>

          {/* Right: Status Box */}
          <StatusBox 
            risk={currentWeather.riskLevel} 
            riskChange={riskChange}
          />
        </div>
      </div>
    </Card>
  );
};

// ============================================
// StatusBox Component
// ============================================

interface StatusBoxProps {
  risk: HourlyForecast['riskLevel'];
  riskChange: RiskChangeInfo | null;
}

const StatusBox: FC<StatusBoxProps> = ({ risk, riskChange }) => {
  const bgColor = {
    'AMAN': 'bg-green-500',
    'RISIKO_RINGAN': 'bg-yellow-500',
    'RISIKO_TINGGI': 'bg-red-500',
  }[risk];

  const actionLabel = {
    'AMAN': 'AMAN BERAKTIVITAS',
    'RISIKO_RINGAN': 'WASPADA',
    'RISIKO_TINGGI': 'HINDARI AKTIVITAS LUAR',
  }[risk];

  const formatHour = (hour: number) => 
    `${String(hour).padStart(2, '0')}:00`;

  return (
    <div className={cn(
      'rounded-xl p-4 text-white text-center flex flex-col justify-center min-h-[120px]',
      bgColor
    )}>
      <div className="text-3xl mb-1">
        {getRiskEmoji(risk)}
      </div>
      <div className="text-xl font-bold">
        {actionLabel}
      </div>
      
      {riskChange && (
        <div className="mt-2 text-sm opacity-90">
          sampai pukul {formatHour(riskChange.changeAtHour)}
        </div>
      )}

      {riskChange && (
        <div className="mt-2 pt-2 border-t border-white/30 text-sm">
          <span className="opacity-75">Setelah itu:</span>{' '}
          <span className="font-medium">
            {getRiskEmoji(riskChange.nextRisk)} {getRiskLabel(riskChange.nextRisk)}
          </span>
        </div>
      )}
    </div>
  );
};
