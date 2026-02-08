/**
 * ForecastSaver Component
 * Client component yang menyimpan prakiraan hari ini ke localStorage
 * saat user pertama kali mengunjungi halaman
 */

'use client';

import { useEffect } from 'react';
import { saveForecast, isTodayForecastStored } from '@/lib/storage';
import type { HourlyForecast, DailySummary } from '@/types/weather';

interface ForecastSaverProps {
  adm4: string;
  locationName: string;
  hourlyForecasts: HourlyForecast[];
  summary: DailySummary;
}

export function ForecastSaver({
  adm4,
  locationName,
  hourlyForecasts,
  summary,
}: ForecastSaverProps) {
  useEffect(() => {
    // Hanya simpan jika belum ada data hari ini
    if (isTodayForecastStored(adm4)) return;

    const today = new Date().toISOString().split('T')[0];

    saveForecast({
      adm4,
      date: today,
      storedAt: new Date().toISOString(),
      locationName,
      forecasts: hourlyForecasts.map(f => ({
        hour: f.hour,
        weatherDesc: f.weatherDesc,
        temperature: f.temperature,
        riskLevel: f.riskLevel,
      })),
      summary: {
        overallRisk: summary.overallRisk,
        narrative: summary.narrative,
      },
    });
  }, [adm4, locationName, hourlyForecasts, summary]);

  // Komponen ini tidak merender apapun
  return null;
}
