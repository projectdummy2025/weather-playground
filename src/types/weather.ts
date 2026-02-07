/**
 * Types untuk data cuaca internal aplikasi
 */

// Level risiko untuk aktivitas luar ruangan
export type RiskLevel = 'AMAN' | 'RISIKO_RINGAN' | 'RISIKO_TINGGI';

// Prakiraan cuaca per jam (data yang sudah diolah)
export interface WeatherForecast {
  localDatetime: string;
  date: Date;
  hour: number;
  temperature: number;
  humidity: number;
  weatherDesc: string;
  weatherDescEn: string;
  windSpeed: number;
  windDirection: string;
  cloudCover: number;
  visibility: string;
  imageUrl: string;
}

// Prakiraan cuaca per jam dengan level risiko
export interface HourlyForecast extends WeatherForecast {
  riskLevel: RiskLevel;
}

// Prakiraan cuaca harian (ringkasan)
export interface DailyForecast {
  date: Date;
  dateString: string;
  hourlyForecasts: HourlyForecast[];
  summary: DailySummary;
}

// Ringkasan harian
export interface DailySummary {
  minTemp: number;
  maxTemp: number;
  dominantWeather: string;
  overallRisk: RiskLevel;
  safeHours: number[];
  riskyHours: number[];
  narrative: string;
}

// Data lokasi untuk display
export interface LocationInfo {
  code: string; // adm4 code
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Combined weather data untuk halaman cuaca
export interface WeatherPageData {
  location: LocationInfo;
  forecasts: DailyForecast[];
  lastUpdated: Date;
}

// Bookmark lokasi (simpan di localStorage)
export interface LocationBookmark {
  code: string;
  name: string; // Format: "Desa, Kecamatan, Kabupaten"
  addedAt: string;
}
