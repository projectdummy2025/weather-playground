/**
 * Location Service
 * Mengelola pencarian dan data wilayah administratif Indonesia
 */

import { query } from '@/lib/db';
import type { LocationSearchResult, Province, Regency, District, Village } from '@/types/location';

const MAX_SEARCH_RESULTS = 10;

/**
 * Mencari lokasi berdasarkan nama desa/kelurahan
 * @param searchQuery - Kata kunci pencarian
 * @param limit - Maksimal hasil (default: 10)
 * @returns Daftar lokasi yang cocok dengan hierarki lengkap
 */
export async function searchLocation(
  searchQuery: string,
  limit: number = MAX_SEARCH_RESULTS
): Promise<LocationSearchResult[]> {
  if (!searchQuery || searchQuery.trim().length < 2) {
    return [];
  }
  
  const sql = `
    SELECT 
      v.code,
      v.name as desa,
      d.name as kecamatan,
      r.name as kabupaten,
      p.name as provinsi
    FROM villages v
    JOIN districts d ON v.district_code = d.code
    JOIN regencies r ON d.regency_code = r.code
    JOIN provinces p ON r.province_code = p.code
    WHERE 
      v.name ILIKE $1 OR
      d.name ILIKE $1 OR
      r.name ILIKE $1
    ORDER BY 
      CASE 
        WHEN v.name ILIKE $2 THEN 1
        WHEN v.name ILIKE $1 THEN 2
        ELSE 3
      END,
      v.name
    LIMIT $3
  `;
  
  const searchPattern = `%${searchQuery.trim()}%`;
  const exactStartPattern = `${searchQuery.trim()}%`;
  
  const results = await query<LocationSearchResult>(sql, [
    searchPattern,
    exactStartPattern,
    limit,
  ]);
  
  return results;
}

/**
 * Mendapatkan detail lokasi berdasarkan kode adm4
 * @param code - Kode wilayah adm4 (desa/kelurahan)
 * @returns Detail lokasi atau null jika tidak ditemukan
 */
export async function getLocationByCode(
  code: string
): Promise<LocationSearchResult | null> {
  const sql = `
    SELECT 
      v.code,
      v.name as desa,
      d.name as kecamatan,
      r.name as kabupaten,
      p.name as provinsi
    FROM villages v
    JOIN districts d ON v.district_code = d.code
    JOIN regencies r ON d.regency_code = r.code
    JOIN provinces p ON r.province_code = p.code
    WHERE v.code = $1
  `;
  
  const results = await query<LocationSearchResult>(sql, [code]);
  
  return results.length > 0 ? results[0] : null;
}

/**
 * Mendapatkan semua provinsi
 */
export async function getAllProvinces(): Promise<Province[]> {
  const sql = `
    SELECT code, name
    FROM provinces
    ORDER BY name
  `;
  
  return query<Province>(sql);
}

/**
 * Mendapatkan kabupaten/kota berdasarkan provinsi
 */
export async function getRegenciesByProvince(
  provinceCode: string
): Promise<Regency[]> {
  const sql = `
    SELECT code, province_code as "provinceCode", name
    FROM regencies
    WHERE province_code = $1
    ORDER BY name
  `;
  
  return query<Regency>(sql, [provinceCode]);
}

/**
 * Mendapatkan kecamatan berdasarkan kabupaten/kota
 */
export async function getDistrictsByRegency(
  regencyCode: string
): Promise<District[]> {
  const sql = `
    SELECT code, regency_code as "regencyCode", name
    FROM districts
    WHERE regency_code = $1
    ORDER BY name
  `;
  
  return query<District>(sql, [regencyCode]);
}

/**
 * Mendapatkan desa/kelurahan berdasarkan kecamatan
 */
export async function getVillagesByDistrict(
  districtCode: string
): Promise<Village[]> {
  const sql = `
    SELECT code, district_code as "districtCode", name
    FROM villages
    WHERE district_code = $1
    ORDER BY name
  `;
  
  return query<Village>(sql, [districtCode]);
}

/**
 * Format nama lokasi lengkap
 * @param location - Data lokasi
 * @returns String dalam format "Desa, Kecamatan, Kabupaten"
 */
export function formatLocationName(location: LocationSearchResult): string {
  return `${location.desa}, ${location.kecamatan}, ${location.kabupaten}`;
}
