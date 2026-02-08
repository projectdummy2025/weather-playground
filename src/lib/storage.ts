/**
 * Local Storage Service
 * Menyimpan dan mengambil data prakiraan cuaca di localStorage
 * untuk fitur "Riwayat Prakiraan vs Realisasi"
 */

import type { RiskLevel } from '@/types/weather';

// ============================================
// Types
// ============================================

export interface StoredForecast {
  adm4: string;
  date: string;              // YYYY-MM-DD
  storedAt: string;          // ISO timestamp
  locationName: string;      // "Gambir, Jakarta Pusat"
  forecasts: {
    hour: number;
    weatherDesc: string;
    temperature: number;
    riskLevel: RiskLevel;
  }[];
  summary: {
    overallRisk: RiskLevel;
    narrative: string;
  };
}

export type FeedbackValue = 'accurate' | 'inaccurate' | 'unknown';

// ============================================
// Constants
// ============================================

const STORAGE_PREFIX = 'cumulus:forecast';
const FEEDBACK_PREFIX = 'cumulus:feedback';
const MAX_STORED_DAYS = 7;

// ============================================
// Forecast Storage
// ============================================

/**
 * Menyimpan prakiraan ke localStorage
 */
export function saveForecast(data: StoredForecast): void {
  try {
    const key = `${STORAGE_PREFIX}:${data.adm4}:${data.date}`;
    localStorage.setItem(key, JSON.stringify(data));
    cleanupOldForecasts(data.adm4);
  } catch (error) {
    // localStorage mungkin penuh atau disabled
    console.warn('Gagal menyimpan prakiraan:', error);
  }
}

/**
 * Mengambil prakiraan dari localStorage
 */
export function getForecast(adm4: string, date: string): StoredForecast | null {
  try {
    const key = `${STORAGE_PREFIX}:${adm4}:${date}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Mengambil prakiraan kemarin
 */
export function getYesterdayForecast(adm4: string): StoredForecast | null {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  return getForecast(adm4, dateStr);
}

/**
 * Cek apakah prakiraan hari ini sudah tersimpan
 */
export function isTodayForecastStored(adm4: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return getForecast(adm4, today) !== null;
}

// ============================================
// Feedback Storage
// ============================================

/**
 * Menyimpan feedback pengguna tentang keakuratan prakiraan
 */
export function saveFeedback(adm4: string, date: string, feedback: FeedbackValue): void {
  try {
    const key = `${FEEDBACK_PREFIX}:${adm4}:${date}`;
    localStorage.setItem(key, feedback);
  } catch (error) {
    console.warn('Gagal menyimpan feedback:', error);
  }
}

/**
 * Mengambil feedback pengguna
 */
export function getFeedback(adm4: string, date: string): FeedbackValue | null {
  try {
    const key = `${FEEDBACK_PREFIX}:${adm4}:${date}`;
    const stored = localStorage.getItem(key);
    return stored as FeedbackValue | null;
  } catch {
    return null;
  }
}

// ============================================
// Cleanup
// ============================================

/**
 * Hapus data yang lebih lama dari MAX_STORED_DAYS
 */
function cleanupOldForecasts(adm4: string): void {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_STORED_DAYS);

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Cleanup forecasts
      if (key.startsWith(`${STORAGE_PREFIX}:${adm4}:`)) {
        const dateStr = key.split(':').pop();
        if (dateStr && new Date(dateStr) < cutoffDate) {
          keysToRemove.push(key);
        }
      }

      // Cleanup feedbacks
      if (key.startsWith(`${FEEDBACK_PREFIX}:${adm4}:`)) {
        const dateStr = key.split(':').pop();
        if (dateStr && new Date(dateStr) < cutoffDate) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Gagal membersihkan data lama:', error);
  }
}
