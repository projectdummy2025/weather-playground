/**
 * Weather Service
 * Mengelola pengambilan dan pengolahan data cuaca
 */

import { fetchWeatherForecast, flattenWeatherData, isValidAdm4Code } from '@/lib/bmkg';
import { getLocationByCode } from '@/services/location';
import { transformToHourlyForecast, generateDailySummary } from '@/services/interpreter';
import type { WeatherPageData, DailyForecast, HourlyForecast, LocationInfo } from '@/types/weather';
import type { BMKGApiResponse } from '@/types/bmkg';

/**
 * Mendapatkan data cuaca lengkap untuk halaman cuaca
 * @param adm4Code - Kode wilayah desa/kelurahan
 * @returns Data cuaca lengkap atau null jika gagal
 */
export async function getWeatherData(
  adm4Code: string
): Promise<WeatherPageData | null> {
  // Validasi kode
  if (!isValidAdm4Code(adm4Code)) {
    console.error('Invalid adm4 code:', adm4Code);
    return null;
  }

  // Ambil data dari BMKG
  const bmkgResponse = await fetchWeatherForecast(adm4Code);

  if (!bmkgResponse) {
    console.error('Failed to fetch weather data from BMKG');
    return null;
  }

  // Transform data
  const location = extractLocationInfo(bmkgResponse);
  const forecasts = processForecasts(bmkgResponse);

  return {
    location,
    forecasts,
    lastUpdated: new Date(),
  };
}

/**
 * Extract location info dari response BMKG
 */
function extractLocationInfo(response: BMKGApiResponse): LocationInfo {
  const loc = response.lokasi;

  return {
    code: loc.adm4,
    desa: loc.desa,
    kecamatan: loc.kecamatan,
    kabupaten: loc.kotkab,
    provinsi: loc.provinsi,
    latitude: loc.lat,
    longitude: loc.lon,
    timezone: loc.timezone,
  };
}

/**
 * Process dan group forecasts by day
 */
function processForecasts(response: BMKGApiResponse): DailyForecast[] {
  const flatData = flattenWeatherData(response);

  // Debug logging
  console.log(`[Weather Service] Processing ${flatData.length} raw forecasts`);

  // Transform ke HourlyForecast dan filter null
  const hourlyForecasts = flatData
    .map(transformToHourlyForecast)
    .filter((f): f is HourlyForecast => f !== null);

  // Debug logging
  console.log(`[Weather Service] Valid forecasts after parsing: ${hourlyForecasts.length}`);

  if (hourlyForecasts.length === 0) {
    console.error('[Weather Service] No valid forecasts after parsing!');
  }

  // Group by date
  const groupedByDate = new Map<string, HourlyForecast[]>();

  hourlyForecasts.forEach(forecast => {
    const dateKey = forecast.date.toISOString().split('T')[0];

    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, []);
    }

    groupedByDate.get(dateKey)!.push(forecast);
  });

  // Convert to DailyForecast array
  const dailyForecasts: DailyForecast[] = [];

  groupedByDate.forEach((hourlyData, dateString) => {
    // Sort by hour
    hourlyData.sort((a, b) => a.hour - b.hour);

    const date = new Date(dateString);
    const summary = generateDailySummary(hourlyData);

    dailyForecasts.push({
      date,
      dateString,
      hourlyForecasts: hourlyData,
      summary,
    });
  });

  // Sort by date
  dailyForecasts.sort((a, b) => a.date.getTime() - b.date.getTime());

  return dailyForecasts;
}

/**
 * Mendapatkan prakiraan untuk hari tertentu
 * @param adm4Code - Kode wilayah
 * @param date - Tanggal yang diminta
 */
export async function getWeatherForDate(
  adm4Code: string,
  date: Date
): Promise<DailyForecast | null> {
  const weatherData = await getWeatherData(adm4Code);

  if (!weatherData) return null;

  const dateString = date.toISOString().split('T')[0];

  return weatherData.forecasts.find(f => f.dateString === dateString) || null;
}

/**
 * Mendapatkan prakiraan cuaca saat ini (jam terdekat)
 */
export async function getCurrentWeather(
  adm4Code: string
): Promise<HourlyForecast | null> {
  const weatherData = await getWeatherData(adm4Code);

  if (!weatherData || weatherData.forecasts.length === 0) {
    return null;
  }

  const now = new Date();
  const currentHour = now.getHours();

  // Cari di hari ini
  const todayForecast = weatherData.forecasts[0];

  if (!todayForecast) return null;

  // Cari jam terdekat
  const closest = todayForecast.hourlyForecasts.reduce((prev, curr) => {
    return Math.abs(curr.hour - currentHour) < Math.abs(prev.hour - currentHour)
      ? curr
      : prev;
  });

  return closest;
}
