/**
 * Types untuk response dari BMKG Public API
 * Endpoint: https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={kode_wilayah}
 */

// Response lokasi dari BMKG
export interface BMKGLocation {
  adm1: string; // Kode provinsi
  adm2: string; // Kode kabupaten/kota
  adm3: string; // Kode kecamatan
  adm4: string; // Kode desa/kelurahan
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lon: number;
  lat: number;
  timezone: string;
}

// Data cuaca per waktu dari BMKG
export interface BMKGWeatherData {
  local_datetime: string; // Format: YYYY-MM-DD HH:mm:ss
  t: number; // Suhu (Celsius)
  hu: number; // Kelembapan (%)
  weather_desc: string; // Deskripsi cuaca (Indonesia)
  weather_desc_en: string; // Deskripsi cuaca (English)
  ws: number; // Kecepatan angin (km/h)
  wd: string; // Arah angin (N, S, E, W, etc.)
  tcc: number; // Tutupan awan (%)
  vs_text: string; // Jarak pandang
  image: string; // URL ikon cuaca
}

// Struktur data cuaca per hari
export interface BMKGDailyData {
  cuaca: BMKGWeatherData[][];
}

// Response lengkap dari BMKG API
export interface BMKGApiResponse {
  lokasi: BMKGLocation;
  data: BMKGDailyData[];
}

// Deskripsi cuaca yang tersedia dari BMKG
export type BMKGWeatherDescription =
  | 'Cerah'
  | 'Cerah Berawan'
  | 'Berawan'
  | 'Berawan Tebal'
  | 'Udara Kabur'
  | 'Hujan Ringan'
  | 'Hujan Sedang'
  | 'Hujan Lebat'
  | 'Hujan Petir';
