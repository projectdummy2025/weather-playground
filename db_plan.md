

-- Updated Database Plan for Wilayah Administratif Indonesia
-- Menggantikan logika berbasis LENGTH(code) dengan jumlah titik ('.')
-- Kompatibel dengan MariaDB 10.11+ dan MySQL

-- LANGKAH 1: BUAT DATABASE DAN USER
CREATE DATABASE IF NOT EXISTS adm4 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'user'@'ip_address' IDENTIFIED BY 'password!';
GRANT ALL PRIVILEGES ON adm4.* TO 'devuser'@'%';  
FLUSH PRIVILEGES;

USE adm4;

-- LANGKAH 2: BUAT TABEL
CREATE TABLE provinces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE regencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    province_id INT NOT NULL,
    code VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('KABUPATEN', 'KOTA') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
);

CREATE TABLE districts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    regency_id INT NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (regency_id) REFERENCES regencies(id) ON DELETE CASCADE
);

CREATE TABLE villages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    district_id INT NOT NULL,
    code VARCHAR(25) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    village_type ENUM('DESA', 'KELURAHAN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- LANGKAH 3: BUAT INDEKS (OPTIMASI)
CREATE INDEX idx_provinces_code ON provinces(code);
CREATE INDEX idx_regencies_code ON regencies(code);
CREATE INDEX idx_districts_code ON districts(code);
CREATE INDEX idx_villages_code ON villages(code);

CREATE INDEX idx_regencies_province_id ON regencies(province_id);
CREATE INDEX idx_districts_regency_id ON districts(regency_id);
CREATE INDEX idx_villages_district_id ON villages(district_id);

CREATE INDEX idx_provinces_name ON provinces(name);
CREATE INDEX idx_regencies_name ON regencies(name);
CREATE INDEX idx_districts_name ON districts(name);
CREATE INDEX idx_villages_name ON villages(name);

CREATE INDEX idx_villages_hierarki ON villages(district_id, code);
CREATE INDEX idx_regencies_nama_tipe ON regencies(type, name);

-- LANGKAH 4: BUAT VIEW
CREATE VIEW wilayah_hierarki AS
SELECT 
    v.id as village_id,
    v.code as village_code,
    v.name as village_name,
    v.village_type,
    d.id as district_id,
    d.code as district_code,
    d.name as district_name,
    r.id as regency_id,
    r.code as regency_code,
    r.name as regency_name,
    r.type as regency_type,
    p.id as province_id,
    p.code as province_code,
    p.name as province_name
FROM villages v
JOIN districts d ON v.district_id = d.id
JOIN regencies r ON d.regency_id = r.id
JOIN provinces p ON r.province_id = p.id;

-- VERIFIKASI
-- Jalankan secara manual setelah impor:
-- SELECT COUNT(*) FROM provinces;   -- Harus ~38
-- SELECT COUNT(*) FROM regencies;   -- Harus ~514
-- SELECT COUNT(*) FROM districts;   -- Harus ~7.300+
-- SELECT COUNT(*) FROM villages;    -- Harus ~80.274