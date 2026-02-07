

```markdown
-- Database Plan Sederhana untuk Wilayah Administratif Indonesia
-- Menggunakan Kode Wilayah sebagai Primary Key

-- LANGKAH 1: BUAT DATABASE (jika belum ada)
CREATE DATABASE IF NOT EXISTS adm4 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE adm4;

-- LANGKAH 2: BUAT TABEL
-- Tabel Provinsi
CREATE TABLE provinces (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tabel Kabupaten/Kota
CREATE TABLE regencies (
    code VARCHAR(15) PRIMARY KEY,
    province_code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (province_code) REFERENCES provinces(code) ON DELETE CASCADE
);

-- Tabel Kecamatan
CREATE TABLE districts (
    code VARCHAR(20) PRIMARY KEY,
    regency_code VARCHAR(15) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (regency_code) REFERENCES regencies(code) ON DELETE CASCADE
);

-- Tabel Desa/Kelurahan
CREATE TABLE villages (
    code VARCHAR(25) PRIMARY KEY,
    district_code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (district_code) REFERENCES districts(code) ON DELETE CASCADE
);

-- LANGKAH 3: BUAT INDEKS PENTING
-- Indeks untuk mempercepat join
CREATE INDEX idx_regencies_province_code ON regencies(province_code);
CREATE INDEX idx_districts_regency_code ON districts(regency_code);
CREATE INDEX idx_villages_district_code ON villages(district_code);

-- Indeks untuk mempercepat pencarian berdasarkan nama
CREATE INDEX idx_provinces_name ON provinces(name);
CREATE INDEX idx_regencies_name ON regencies(name);
CREATE INDEX idx_districts_name ON districts(name);
CREATE INDEX idx_villages_name ON villages(name);
```