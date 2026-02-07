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
