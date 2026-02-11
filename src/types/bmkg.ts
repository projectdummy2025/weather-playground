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
  type?: string; // Tipe lokasi (muncul di data.lokasi)
}

// Data cuaca per waktu dari BMKG
export interface BMKGWeatherData {
  // Waktu
  datetime: string; // UTC datetime ISO format
  utc_datetime: string; // UTC datetime natural
  local_datetime: string; // Format: YYYY-MM-DD HH:mm:ss
  time_index: string; // Index waktu (misal: "3-4")
  analysis_date: string; // Tanggal analisis

  // Cuaca
  weather: number; // Kode cuaca (integer)
  weather_desc: string; // Deskripsi cuaca (Indonesia)
  weather_desc_en: string; // Deskripsi cuaca (English)
  image: string; // URL ikon cuaca

  // Temperatur & Kelembaban
  t: number; // Suhu (Celsius)
  hu: number; // Kelembapan (%)
  tp: number; // Total precipitation

  // Angin
  ws: number; // Kecepatan angin (km/h)
  wd: string; // Arah angin (N, S, E, W, etc.)
  wd_deg: number; // Arah angin dalam derajat
  wd_to: string; // Arah tujuan angin

  // Awan & Visibilitas
  tcc: number; // Tutupan awan (%)
  vs: number; // Visibilitas dalam meter
  vs_text: string; // Jarak pandang
}

// Struktur data cuaca per item
export interface BMKGDailyData {
  lokasi: BMKGLocation; // Lokasi info per data item
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
