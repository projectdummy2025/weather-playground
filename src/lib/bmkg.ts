/**
 * BMKG API Client
 * Mengambil data prakiraan cuaca dari BMKG Public API
 */

import type { BMKGApiResponse, BMKGWeatherData } from '@/types/bmkg';

const BMKG_API_URL = process.env.BMKG_API_URL || 'https://api.bmkg.go.id/publik/prakiraan-cuaca';

// Rate limiting: max 60 requests per minute
const REQUEST_DELAY_MS = 1000; // 1 second between requests to be safe
let lastRequestTime = 0;

/**
 * Menunggu sebelum melakukan request (rate limiting)
 */
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < REQUEST_DELAY_MS) {
    await new Promise(resolve =>
      setTimeout(resolve, REQUEST_DELAY_MS - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
}

/**
 * Mengambil prakiraan cuaca berdasarkan kode wilayah (adm4)
 * @param adm4Code - Kode wilayah desa/kelurahan (contoh: "31.71.01.1001")
 * @returns Data prakiraan cuaca dari BMKG
 */
export async function fetchWeatherForecast(
  adm4Code: string
): Promise<BMKGApiResponse | null> {
  await waitForRateLimit();

  try {
    const url = `${BMKG_API_URL}?adm4=${encodeURIComponent(adm4Code)}`;

    console.log('🌤️ [BMKG API] Fetching weather for:', adm4Code);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      console.error(`❌ [BMKG API] HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    // Validate structure
    if (!data.lokasi || !data.data || !Array.isArray(data.data)) {
      console.error('❌ [BMKG API] Invalid response structure:', {
        has_lokasi: !!data.lokasi,
        has_data: !!data.data,
        is_array: Array.isArray(data.data),
      });
      return null;
    }

    // Log success details
    const totalForecasts = data.data.reduce((sum: number, day: any) => {
      return sum + day.cuaca.reduce((s: number, group: any) => s + group.length, 0);
    }, 0);

    console.log(`✅ [BMKG API] Fetched ${data.data.length} days, ${totalForecasts} total forecasts`);

    return data as BMKGApiResponse;
  } catch (error) {
    console.error('❌ [BMKG API] Fetch error:', error);
    return null;
  }
}

/**
 * Flatten data cuaca dari response BMKG
 * BMKG mengembalikan data dalam nested array, fungsi ini memflattennya
 */
export function flattenWeatherData(
  response: BMKGApiResponse
): BMKGWeatherData[] {
  const allData: BMKGWeatherData[] = [];

  for (const dailyData of response.data) {
    for (const cuacaGroup of dailyData.cuaca) {
      for (const cuaca of cuacaGroup) {
        allData.push(cuaca);
      }
    }
  }

  // Sort by datetime
  return allData.sort((a, b) =>
    new Date(a.local_datetime).getTime() - new Date(b.local_datetime).getTime()
  );
}

/**
 * Validasi format kode adm4
 * Format: XX.XX.XX.XXXX (contoh: 31.71.01.1001)
 */
export function isValidAdm4Code(code: string): boolean {
  const pattern = /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/;
  return pattern.test(code);
}
