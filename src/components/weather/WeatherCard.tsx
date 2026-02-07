/**
 * WeatherCard Component
 * Menampilkan cuaca saat ini dalam bentuk kartu besar
 */

import { type FC } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, RiskBadge } from '@/components/ui';
import type { HourlyForecast, LocationInfo } from '@/types/weather';

interface WeatherCardProps {
  location: LocationInfo;
  currentWeather: HourlyForecast;
  className?: string;
}

export const WeatherCard: FC<WeatherCardProps> = ({
  location,
  currentWeather,
  className,
}) => {
  return (
    <Card variant="elevated" className={cn('relative overflow-hidden', className)}>
      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📍</span>
        <div>
          <h2 className="font-semibold text-slate-900">
            {location.desa}, {location.kecamatan}
          </h2>
          <p className="text-sm text-slate-500">
            {location.kabupaten}
          </p>
        </div>
      </div>
      
      {/* Main Weather Display */}
      <div className="flex items-center justify-between">
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
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🌤️
              </div>
            )}
          </div>
          
          {/* Temperature */}
          <div>
            <div className="text-5xl font-bold text-slate-900">
              {currentWeather.temperature}°
            </div>
            <div className="text-slate-500">
              {currentWeather.weatherDesc}
            </div>
          </div>
        </div>
        
        {/* Risk Badge */}
        <RiskBadge risk={currentWeather.riskLevel} />
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-slate-500 mb-1">Kelembapan</div>
          <div className="font-medium">{currentWeather.humidity}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Angin</div>
          <div className="font-medium">{currentWeather.windSpeed} km/h</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Arah</div>
          <div className="font-medium">{currentWeather.windDirection}</div>
        </div>
      </div>
    </Card>
  );
};
