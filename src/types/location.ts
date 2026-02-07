/**
 * Types untuk data wilayah administratif
 */

// Provinsi (adm1)
export interface Province {
  code: string;
  name: string;
}

// Kabupaten/Kota (adm2)
export interface Regency {
  code: string;
  provinceCode: string;
  name: string;
}

// Kecamatan (adm3)
export interface District {
  code: string;
  regencyCode: string;
  name: string;
}

// Desa/Kelurahan (adm4)
export interface Village {
  code: string;
  districtCode: string;
  name: string;
}

// Hasil pencarian lokasi (dengan hierarki lengkap)
export interface LocationSearchResult {
  code: string; // adm4 code
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
}

// Query parameter untuk pencarian
export interface LocationSearchParams {
  query: string;
  limit?: number;
}
