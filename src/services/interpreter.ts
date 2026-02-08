/**
 * Weather Interpretation Service
 * Menerjemahkan data cuaca mentah menjadi informasi yang actionable
 */

import type { RiskLevel, HourlyForecast, DailySummary, WeatherForecast } from '@/types/weather';
import type { BMKGWeatherData } from '@/types/bmkg';

// Deskripsi cuaca dengan risiko tinggi
const HIGH_RISK_WEATHER = [
  'Hujan Sedang',
  'Hujan Lebat',
  'Hujan Petir',
];

// Deskripsi cuaca dengan risiko ringan
const MEDIUM_RISK_WEATHER = [
  'Hujan Ringan',
  'Berawan Tebal',
  'Udara Kabur',
];

// Threshold kecepatan angin (km/h) yang dianggap berbahaya
const HIGH_WIND_SPEED_THRESHOLD = 40;
const MEDIUM_WIND_SPEED_THRESHOLD = 25;

/**
 * Mengklasifikasikan kondisi cuaca ke level risiko
 * @param weatherDesc - Deskripsi cuaca dari BMKG
 * @param windSpeed - Kecepatan angin (km/h)
 * @returns Level risiko: AMAN, RISIKO_RINGAN, atau RISIKO_TINGGI
 */
export function classifyWeatherRisk(
  weatherDesc: string,
  windSpeed: number = 0
): RiskLevel {
  // Cek angin kencang terlebih dahulu
  if (windSpeed >= HIGH_WIND_SPEED_THRESHOLD) {
    return 'RISIKO_TINGGI';
  }
  
  if (windSpeed >= MEDIUM_WIND_SPEED_THRESHOLD) {
    // Angin sedang + cuaca buruk = risiko tinggi
    if (MEDIUM_RISK_WEATHER.includes(weatherDesc)) {
      return 'RISIKO_TINGGI';
    }
    return 'RISIKO_RINGAN';
  }
  
  // Klasifikasi berdasarkan cuaca
  if (HIGH_RISK_WEATHER.includes(weatherDesc)) {
    return 'RISIKO_TINGGI';
  }
  
  if (MEDIUM_RISK_WEATHER.includes(weatherDesc)) {
    return 'RISIKO_RINGAN';
  }
  
  return 'AMAN';
}

/**
 * Mengubah data BMKG menjadi format internal HourlyForecast
 */
export function transformToHourlyForecast(
  bmkgData: BMKGWeatherData
): HourlyForecast {
  const date = new Date(bmkgData.local_datetime);
  
  const forecast: WeatherForecast = {
    localDatetime: bmkgData.local_datetime,
    date,
    hour: date.getHours(),
    temperature: bmkgData.t,
    humidity: bmkgData.hu,
    weatherDesc: bmkgData.weather_desc,
    weatherDescEn: bmkgData.weather_desc_en || '',
    windSpeed: bmkgData.ws,
    windDirection: bmkgData.wd,
    cloudCover: bmkgData.tcc || 0,
    visibility: bmkgData.vs_text || '',
    imageUrl: bmkgData.image,
  };
  
  return {
    ...forecast,
    riskLevel: classifyWeatherRisk(bmkgData.weather_desc, bmkgData.ws),
  };
}

/**
 * Generate ringkasan harian dari data per jam
 */
export function generateDailySummary(
  hourlyForecasts: HourlyForecast[]
): DailySummary {
  if (hourlyForecasts.length === 0) {
    return {
      minTemp: 0,
      maxTemp: 0,
      dominantWeather: 'Tidak ada data',
      overallRisk: 'AMAN',
      safeHours: [],
      riskyHours: [],
      narrative: 'Data cuaca tidak tersedia.',
    };
  }
  
  // Hitung min/max suhu
  const temps = hourlyForecasts.map(f => f.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  
  // Hitung cuaca dominan
  const weatherCounts = new Map<string, number>();
  hourlyForecasts.forEach(f => {
    const count = weatherCounts.get(f.weatherDesc) || 0;
    weatherCounts.set(f.weatherDesc, count + 1);
  });
  
  let dominantWeather = '';
  let maxCount = 0;
  weatherCounts.forEach((count, weather) => {
    if (count > maxCount) {
      maxCount = count;
      dominantWeather = weather;
    }
  });
  
  // Kategorikan jam
  const safeHours: number[] = [];
  const riskyHours: number[] = [];
  
  hourlyForecasts.forEach(f => {
    if (f.riskLevel === 'AMAN') {
      safeHours.push(f.hour);
    } else {
      riskyHours.push(f.hour);
    }
  });
  
  // Tentukan overall risk
  const highRiskCount = hourlyForecasts.filter(f => f.riskLevel === 'RISIKO_TINGGI').length;
  const mediumRiskCount = hourlyForecasts.filter(f => f.riskLevel === 'RISIKO_RINGAN').length;
  
  let overallRisk: RiskLevel = 'AMAN';
  if (highRiskCount > hourlyForecasts.length / 2) {
    overallRisk = 'RISIKO_TINGGI';
  } else if (highRiskCount > 0 || mediumRiskCount > hourlyForecasts.length / 2) {
    overallRisk = 'RISIKO_RINGAN';
  }
  
  // Generate narasi
  const narrative = generateNarrative(hourlyForecasts, safeHours, riskyHours);
  
  return {
    minTemp,
    maxTemp,
    dominantWeather,
    overallRisk,
    safeHours,
    riskyHours,
    narrative,
  };
}

/**
 * Generate narasi bahasa awam dari data cuaca
 */
function generateNarrative(
  forecasts: HourlyForecast[],
  safeHours: number[],
  riskyHours: number[]
): string {
  if (forecasts.length === 0) {
    return 'Data cuaca tidak tersedia.';
  }
  
  // Kelompokkan forecast berdasarkan waktu
  const pagi = forecasts.filter(f => f.hour >= 6 && f.hour < 12);
  const siang = forecasts.filter(f => f.hour >= 12 && f.hour < 15);
  const sore = forecasts.filter(f => f.hour >= 15 && f.hour < 18);
  const malam = forecasts.filter(f => f.hour >= 18 || f.hour < 6);
  
  const parts: string[] = [];
  
  // Deskripsi kondisi per waktu
  if (pagi.length > 0) {
    const pagiRisk = pagi.some(f => f.riskLevel !== 'AMAN');
    const pagiWeather = pagi[0]?.weatherDesc || '';
    parts.push(pagiRisk 
      ? `Pagi hari perlu waspada (${pagiWeather.toLowerCase()})`
      : `Pagi hari ${pagiWeather.toLowerCase()}`
    );
  }
  
  if (siang.length > 0 || sore.length > 0) {
    const siangSore = [...siang, ...sore];
    const hasRain = siangSore.some(f => 
      f.weatherDesc.toLowerCase().includes('hujan')
    );
    
    if (hasRain) {
      const rainStart = siangSore.find(f => 
        f.weatherDesc.toLowerCase().includes('hujan')
      );
      if (rainStart) {
        parts.push(`kemungkinan hujan mulai jam ${rainStart.hour}:00`);
      }
    }
  }
  
  // Rekomendasi
  if (safeHours.length > 0 && riskyHours.length > 0) {
    const firstSafe = Math.min(...safeHours);
    const lastSafe = Math.max(...safeHours);
    
    if (safeHours.length >= riskyHours.length) {
      parts.push(`Waktu terbaik untuk aktivitas luar: ${firstSafe}:00 - ${lastSafe}:00`);
    } else {
      parts.push(`Sebaiknya siapkan payung atau jas hujan`);
    }
  } else if (riskyHours.length === 0) {
    parts.push(`Cuaca mendukung untuk aktivitas luar ruangan sepanjang hari`);
  } else {
    parts.push(`Sebaiknya tunda aktivitas luar ruangan jika memungkinkan`);
  }
  
  return parts.join('. ') + '.';
}

/**
 * Mendapatkan warna berdasarkan risk level
 */
export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'AMAN':
      return '#22c55e'; // green-500
    case 'RISIKO_RINGAN':
      return '#eab308'; // yellow-500
    case 'RISIKO_TINGGI':
      return '#ef4444'; // red-500
    default:
      return '#64748b'; // slate-500
  }
}

/**
 * Mendapatkan label Indonesia untuk risk level
 */
export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'AMAN':
      return 'Aman';
    case 'RISIKO_RINGAN':
      return 'Waspada';
    case 'RISIKO_TINGGI':
      return 'Hindari';
    default:
      return 'Tidak diketahui';
  }
}

/**
 * Mendapatkan emoji untuk risk level
 */
export function getRiskEmoji(risk: RiskLevel): string {
  switch (risk) {
    case 'AMAN':
      return '🟢';
    case 'RISIKO_RINGAN':
      return '🟡';
    case 'RISIKO_TINGGI':
      return '🔴';
    default:
      return '⚪';
  }
}

// ============================================
// FASE 1B: FUNGSI INTERPRETER BARU
// ============================================

/**
 * Info perubahan risiko berikutnya
 */
export interface RiskChangeInfo {
  currentRisk: RiskLevel;
  nextRisk: RiskLevel;
  changeAtHour: number;
  hoursUntilChange: number;
}

/**
 * Mendapatkan informasi kapan risiko berubah dari status saat ini
 */
export function getNextRiskChange(
  forecasts: HourlyForecast[]
): RiskChangeInfo | null {
  if (forecasts.length === 0) return null;

  const now = new Date();
  const currentHour = now.getHours();

  // Filter hanya forecast dari jam sekarang ke depan
  const futureForecasts = forecasts.filter(f => f.hour >= currentHour);
  if (futureForecasts.length === 0) return null;

  const currentForecast = futureForecasts[0];
  const currentRisk = currentForecast.riskLevel;

  // Cari forecast dengan risiko berbeda
  for (let i = 1; i < futureForecasts.length; i++) {
    if (futureForecasts[i].riskLevel !== currentRisk) {
      return {
        currentRisk,
        nextRisk: futureForecasts[i].riskLevel,
        changeAtHour: futureForecasts[i].hour,
        hoursUntilChange: futureForecasts[i].hour - currentHour,
      };
    }
  }

  return null; // Risiko tidak berubah
}

/**
 * Segment waktu (Pagi, Siang, Sore, Malam)
 */
export interface TimeSegment {
  label: 'Pagi' | 'Siang' | 'Sore' | 'Malam';
  timeRange: string;
  startHour: number;
  endHour: number;
  hours: HourlyForecast[];
  dominantRisk: RiskLevel;
  tempRange: { min: number; max: number };
  dominantWeather: string;
}

/**
 * Mengelompokkan forecast ke dalam 4 segment waktu
 */
export function groupIntoSegments(
  forecasts: HourlyForecast[]
): TimeSegment[] {
  const segmentConfig = [
    { label: 'Pagi' as const, startHour: 6, endHour: 12, timeRange: '06:00 - 12:00' },
    { label: 'Siang' as const, startHour: 12, endHour: 15, timeRange: '12:00 - 15:00' },
    { label: 'Sore' as const, startHour: 15, endHour: 18, timeRange: '15:00 - 18:00' },
    { label: 'Malam' as const, startHour: 18, endHour: 24, timeRange: '18:00 - 00:00' },
  ];

  return segmentConfig.map(config => {
    const hours = forecasts.filter(
      f => f.hour >= config.startHour && f.hour < config.endHour
    );

    // Hitung dominant risk
    const riskCounts = { AMAN: 0, RISIKO_RINGAN: 0, RISIKO_TINGGI: 0 };
    hours.forEach(h => {
      riskCounts[h.riskLevel]++;
    });

    let dominantRisk: RiskLevel = 'AMAN';
    if (riskCounts.RISIKO_TINGGI > 0) {
      dominantRisk = 'RISIKO_TINGGI';
    } else if (riskCounts.RISIKO_RINGAN > 0) {
      dominantRisk = 'RISIKO_RINGAN';
    }

    // Hitung suhu min/max
    const temps = hours.map(h => h.temperature);
    const tempRange = {
      min: temps.length > 0 ? Math.min(...temps) : 0,
      max: temps.length > 0 ? Math.max(...temps) : 0,
    };

    // Hitung cuaca dominan
    const weatherCounts = new Map<string, number>();
    hours.forEach(h => {
      const count = weatherCounts.get(h.weatherDesc) || 0;
      weatherCounts.set(h.weatherDesc, count + 1);
    });

    let dominantWeather = '';
    let maxCount = 0;
    weatherCounts.forEach((count, weather) => {
      if (count > maxCount) {
        maxCount = count;
        dominantWeather = weather;
      }
    });

    return {
      label: config.label,
      timeRange: config.timeRange,
      startHour: config.startHour,
      endHour: config.endHour,
      hours,
      dominantRisk,
      tempRange,
      dominantWeather,
    };
  });
}

/**
 * Action item untuk rekomendasi
 */
export interface ActionItem {
  type: 'safe' | 'warning' | 'info';
  text: string;
}

/**
 * Generate maks 3 bullet points rekomendasi
 */
export function generateActionItems(
  forecasts: HourlyForecast[]
): ActionItem[] {
  const items: ActionItem[] = [];
  const segments = groupIntoSegments(forecasts);

  // Cek kondisi pagi
  const pagi = segments.find(s => s.label === 'Pagi');
  if (pagi && pagi.hours.length > 0) {
    if (pagi.dominantRisk === 'AMAN') {
      items.push({ type: 'safe', text: 'Pagi cerah, cocok untuk aktivitas luar' });
    } else if (pagi.dominantRisk === 'RISIKO_TINGGI') {
      items.push({ type: 'warning', text: 'Pagi hari berpotensi hujan, siapkan payung' });
    }
  }

  // Cek kondisi siang/sore
  const siang = segments.find(s => s.label === 'Siang');
  const sore = segments.find(s => s.label === 'Sore');
  
  if (siang?.dominantRisk === 'RISIKO_TINGGI' || sore?.dominantRisk === 'RISIKO_TINGGI') {
    const jamMulai = siang?.dominantRisk === 'RISIKO_TINGGI' ? 12 : 15;
    items.push({ type: 'warning', text: `Siapkan payung setelah jam ${jamMulai}:00` });
  }

  // Cek kondisi malam
  const malam = segments.find(s => s.label === 'Malam');
  if (malam && malam.hours.length > 0) {
    if (malam.dominantRisk === 'AMAN') {
      items.push({ type: 'safe', text: 'Malam aman untuk pulang kerja' });
    } else if (malam.dominantRisk === 'RISIKO_TINGGI') {
      items.push({ type: 'warning', text: 'Malam berpotensi hujan, pulang lebih awal' });
    }
  }

  // Jika tidak ada items, berikan info umum
  if (items.length === 0) {
    const overallSafe = forecasts.every(f => f.riskLevel === 'AMAN');
    if (overallSafe) {
      items.push({ type: 'safe', text: 'Cuaca mendukung aktivitas sepanjang hari' });
    } else {
      items.push({ type: 'info', text: 'Pantau terus kondisi cuaca hari ini' });
    }
  }

  // Maksimal 3 items
  return items.slice(0, 3);
}

/**
 * Jendela waktu
 */
export interface TimeWindow {
  start: number;
  end: number;
  duration: number;
}

/**
 * Cari rentang waktu AMAN terpanjang
 */
export function findBestActivityWindow(
  forecasts: HourlyForecast[]
): TimeWindow | null {
  if (forecasts.length === 0) return null;

  // Filter jam 6 pagi sampai 18 sore (jam aktivitas normal)
  const activityHours = forecasts.filter(f => f.hour >= 6 && f.hour <= 18);
  if (activityHours.length === 0) return null;

  let bestWindow: TimeWindow | null = null;
  let currentStart: number | null = null;
  let currentEnd: number | null = null;

  for (const forecast of activityHours) {
    if (forecast.riskLevel === 'AMAN') {
      if (currentStart === null) {
        currentStart = forecast.hour;
        currentEnd = forecast.hour;
      } else {
        currentEnd = forecast.hour;
      }
    } else {
      // Akhir dari window aman
      if (currentStart !== null && currentEnd !== null) {
        const duration = currentEnd - currentStart + 1;
        if (!bestWindow || duration > bestWindow.duration) {
          bestWindow = { start: currentStart, end: currentEnd, duration };
        }
      }
      currentStart = null;
      currentEnd = null;
    }
  }

  // Cek window terakhir
  if (currentStart !== null && currentEnd !== null) {
    const duration = currentEnd - currentStart + 1;
    if (!bestWindow || duration > bestWindow.duration) {
      bestWindow = { start: currentStart, end: currentEnd, duration };
    }
  }

  return bestWindow;
}

/**
 * Cari rentang waktu BERISIKO terpanjang
 */
export function findWorstActivityWindow(
  forecasts: HourlyForecast[]
): TimeWindow | null {
  if (forecasts.length === 0) return null;

  // Filter jam 6 pagi sampai 18 sore (jam aktivitas normal)
  const activityHours = forecasts.filter(f => f.hour >= 6 && f.hour <= 18);
  if (activityHours.length === 0) return null;

  let worstWindow: TimeWindow | null = null;
  let currentStart: number | null = null;
  let currentEnd: number | null = null;

  for (const forecast of activityHours) {
    if (forecast.riskLevel === 'RISIKO_TINGGI') {
      if (currentStart === null) {
        currentStart = forecast.hour;
        currentEnd = forecast.hour;
      } else {
        currentEnd = forecast.hour;
      }
    } else {
      // Akhir dari window berisiko
      if (currentStart !== null && currentEnd !== null) {
        const duration = currentEnd - currentStart + 1;
        if (!worstWindow || duration > worstWindow.duration) {
          worstWindow = { start: currentStart, end: currentEnd, duration };
        }
      }
      currentStart = null;
      currentEnd = null;
    }
  }

  // Cek window terakhir
  if (currentStart !== null && currentEnd !== null) {
    const duration = currentEnd - currentStart + 1;
    if (!worstWindow || duration > worstWindow.duration) {
      worstWindow = { start: currentStart, end: currentEnd, duration };
    }
  }

  return worstWindow;
}
