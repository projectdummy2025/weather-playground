/**
 * Weather Page - Halaman Cuaca per Lokasi
 * Dynamic route: /[adm4]
 */

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getWeatherData } from '@/services/weather';
import { isValidAdm4Code } from '@/lib/bmkg';
import { formatDateIndonesia } from '@/lib/utils';
import { LocationHeader } from '@/components/location';
import { 
  WeatherCard, 
  Timeline, 
  NarrativeSummary, 
  DailyForecastCard 
} from '@/components/weather';
import { LoadingPage } from '@/components/ui';

interface WeatherPageProps {
  params: Promise<{ adm4: string }>;
}

export default async function WeatherPage({ params }: WeatherPageProps) {
  const { adm4 } = await params;
  
  // Validate adm4 code format
  if (!isValidAdm4Code(adm4)) {
    notFound();
  }
  
  // Fetch weather data
  const weatherData = await getWeatherData(adm4);
  
  if (!weatherData) {
    notFound();
  }
  
  const { location, forecasts, lastUpdated } = weatherData;
  const todayForecast = forecasts[0];
  const upcomingForecasts = forecasts.slice(1);
  
  // Get current weather (closest to current hour)
  const now = new Date();
  const currentHour = now.getHours();
  const currentWeather = todayForecast?.hourlyForecasts.reduce((prev, curr) => {
    return Math.abs(curr.hour - currentHour) < Math.abs(prev.hour - currentHour)
      ? curr
      : prev;
  }) || todayForecast?.hourlyForecasts[0];
  
  if (!currentWeather || !todayForecast) {
    notFound();
  }
  
  return (
    <main className="px-4 py-4 pb-16 space-y-4">
      {/* Location Header */}
      <LocationHeader location={location} />
      
      {/* Current Weather Card */}
      <WeatherCard 
        location={location} 
        currentWeather={currentWeather} 
      />
      
      {/* Today's Timeline */}
      <Timeline forecasts={todayForecast.hourlyForecasts} />
      
      {/* Daily Summary */}
      <NarrativeSummary summary={todayForecast.summary} />
      
      {/* Upcoming Days */}
      {upcomingForecasts.length > 0 && (
        <section>
          <h2 className="font-semibold text-slate-900 mb-3">
            Prakiraan Beberapa Hari ke Depan
          </h2>
          <div className="space-y-3">
            {upcomingForecasts.map((forecast, index) => (
              <DailyForecastCard
                key={forecast.dateString}
                forecast={forecast}
                locationCode={adm4}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Last updated */}
      <div className="text-center text-xs text-slate-400 pt-4">
        Diperbarui: {formatDateIndonesia(lastUpdated)}, {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: WeatherPageProps) {
  const { adm4 } = await params;
  
  if (!isValidAdm4Code(adm4)) {
    return { title: 'Lokasi Tidak Ditemukan' };
  }
  
  const weatherData = await getWeatherData(adm4);
  
  if (!weatherData) {
    return { title: 'Lokasi Tidak Ditemukan' };
  }
  
  const { location } = weatherData;
  
  return {
    title: `Cuaca ${location.desa}, ${location.kecamatan} - Cumulus`,
    description: `Prakiraan cuaca untuk ${location.desa}, ${location.kecamatan}, ${location.kabupaten}. Lihat jam aman dan jam berisiko untuk aktivitas luar ruangan.`,
  };
}
