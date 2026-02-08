/**
 * Weather Page - Halaman Cuaca per Lokasi (Redesigned)
 * Dynamic route: /[adm4]
 * Mobile & Desktop responsive layout
 */

import { notFound } from 'next/navigation';
import { getWeatherData } from '@/services/weather';
import { isValidAdm4Code } from '@/lib/bmkg';
import { formatDateIndonesia } from '@/lib/utils';
import { LocationHeader } from '@/components/location';
import { 
  WeatherCard, 
  Timeline, 
  NarrativeSummary, 
  DailyForecastCard,
  ForecastSaver,
  HistoryCard,
} from '@/components/weather';

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
    <main className="px-4 py-4 pb-16 max-w-5xl mx-auto">
      {/* Location Header */}
      <LocationHeader location={location} />

      {/* Save today's forecast to localStorage */}
      <ForecastSaver
        adm4={adm4}
        locationName={`${location.desa}, ${location.kecamatan}`}
        hourlyForecasts={todayForecast.hourlyForecasts}
        summary={todayForecast.summary}
      />
      
      {/* Mobile Layout: Stacked */}
      <div className="md:hidden space-y-4 mt-4">
        {/* Hero: Weather Card with Status */}
        <WeatherCard 
          location={location} 
          currentWeather={currentWeather}
          forecasts={todayForecast.hourlyForecasts}
        />
        
        {/* Timeline Bar */}
        <Timeline forecasts={todayForecast.hourlyForecasts} />
        
        {/* Recommendations */}
        <NarrativeSummary 
          summary={todayForecast.summary}
          forecasts={todayForecast.hourlyForecasts}
        />

        {/* Riwayat Prakiraan Kemarin */}
        <HistoryCard adm4={adm4} />
        
        {/* Upcoming Days */}
        {upcomingForecasts.length > 0 && (
          <section>
            <h2 className="font-semibold text-slate-900 mb-3">
              Prakiraan Beberapa Hari ke Depan
            </h2>
            <div className="space-y-3">
              {upcomingForecasts.map((forecast) => (
                <DailyForecastCard
                  key={forecast.dateString}
                  forecast={forecast}
                  locationCode={adm4}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Desktop Layout: Grid */}
      <div className="hidden md:block space-y-6 mt-4">
        {/* Top Row: Hero + Timeline side by side */}
        <div className="grid grid-cols-2 gap-6">
          <WeatherCard 
            location={location} 
            currentWeather={currentWeather}
            forecasts={todayForecast.hourlyForecasts}
          />
          <Timeline forecasts={todayForecast.hourlyForecasts} />
        </div>
        
        {/* Recommendations - Full width */}
        <NarrativeSummary 
          summary={todayForecast.summary}
          forecasts={todayForecast.hourlyForecasts}
        />

        {/* Riwayat Prakiraan Kemarin */}
        <HistoryCard adm4={adm4} />
        
        {/* Upcoming Days - 3 column grid */}
        {upcomingForecasts.length > 0 && (
          <section>
            <h2 className="font-semibold text-slate-900 mb-3 text-lg">
              Prakiraan Beberapa Hari ke Depan
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {upcomingForecasts.map((forecast) => (
                <DailyForecastCard
                  key={forecast.dateString}
                  forecast={forecast}
                  locationCode={adm4}
                />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Last updated */}
      <div className="text-center text-xs text-slate-400 pt-6">
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
