-- ============================================
-- CUMULUS - Database Migration
-- ============================================
-- Jalankan script ini di PostgreSQL untuk membuat tabel wilayah

-- Hapus tabel jika sudah ada (untuk fresh migration)
DROP TABLE IF EXISTS villages CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS regencies CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;

-- 1. Tabel Provinsi
CREATE TABLE provinces (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 2. Tabel Kabupaten/Kota
CREATE TABLE regencies (
    code VARCHAR(15) PRIMARY KEY,
    province_code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (province_code) REFERENCES provinces(code) ON DELETE CASCADE
);

-- 3. Tabel Kecamatan
CREATE TABLE districts (
    code VARCHAR(20) PRIMARY KEY,
    regency_code VARCHAR(15) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (regency_code) REFERENCES regencies(code) ON DELETE CASCADE
);

-- 4. Tabel Desa/Kelurahan
CREATE TABLE villages (
    code VARCHAR(25) PRIMARY KEY,
    district_code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (district_code) REFERENCES districts(code) ON DELETE CASCADE
);

-- Indeks untuk performa pencarian
CREATE INDEX idx_regencies_province_code ON regencies(province_code);
CREATE INDEX idx_districts_regency_code ON districts(regency_code);
CREATE INDEX idx_villages_district_code ON villages(district_code);

-- Indeks untuk pencarian berdasarkan nama
CREATE INDEX idx_provinces_name ON provinces(name);
CREATE INDEX idx_regencies_name ON regencies(name);
CREATE INDEX idx_districts_name ON districts(name);
CREATE INDEX idx_villages_name ON villages(name);

-- Indeks untuk pencarian case-insensitive (trigram)
-- Uncomment jika extension pg_trgm tersedia:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX idx_villages_name_trgm ON villages USING gin(name gin_trgm_ops);

COMMENT ON TABLE provinces IS 'Tabel provinsi Indonesia (38 provinsi)';
COMMENT ON TABLE regencies IS 'Tabel kabupaten/kota (~514 kab/kota)';
COMMENT ON TABLE districts IS 'Tabel kecamatan (~7.266 kecamatan)';
COMMENT ON TABLE villages IS 'Tabel desa/kelurahan (~83.000+ desa)';
