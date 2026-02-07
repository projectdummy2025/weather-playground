

# Rencana Database untuk Wilayah Administratif Indonesia

Dokumen ini menjelaskan struktur database yang dirancang untuk menyimpan data wilayah administratif Indonesia berdasarkan data dari `kode-wilayah.csv`. Desain ini dibuat sederhana dan efisien, menggunakan kode wilayah resmi sebagai kunci utama untuk kemudahan integrasi.

## Konsep Desain

Struktur database ini menggunakan pendekatan relasional hierarkis, di mana setiap tingkatan administrasi (provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan) disimpan dalam tabel terpisah.

- **Primary Key**: Menggunakan `code` (kode wilayah) sebagai *Primary Key* untuk setiap tabel. Ini memastikan keunikan data sesuai standar pemerintah dan mempermudah pencarian langsung tanpa perlu `JOIN` jika kode sudah diketahui.
- **Foreign Key**: Relasi antar tabel dibangun menggunakan `FOREIGN KEY` yang merujuk pada `code` dari tabel induknya. Ini menjaga integritas dan konsistensi data.
- **Normalisasi**: Data dinormalisasi ke dalam beberapa tabel untuk mengurangi redundansi dan meningkatkan efisiensi penyimpanan.

---

## Struktur Tabel

Berikut adalah detail untuk setiap tabel dalam database.

### 1. Tabel `provinces`
Tabel ini menyimpan data seluruh provinsi di Indonesia.

- `code` (VARCHAR(10), Primary Key): Kode unik provinsi (contoh: `11`).
- `name` (VARCHAR(255)): Nama lengkap provinsi (contoh: `ACEH`).

### 2. Tabel `regencies`
Tabel ini menyimpan data kabupaten dan kota, yang merupakan bagian dari sebuah provinsi.

- `code` (VARCHAR(15), Primary Key): Kode unik kabupaten/kota (contoh: `11.01`).
- `province_code` (VARCHAR(10), Foreign Key): Kode provinsi induk, merujuk ke `provinces.code`.
- `name` (VARCHAR(255)): Nama lengkap kabupaten/kota (contoh: `KAB. ACEH SELATAN`).

### 3. Tabel `districts`
Tabel ini menyimpan data kecamatan, yang merupakan bagian dari sebuah kabupaten/kota.

- `code` (VARCHAR(20), Primary Key): Kode unik kecamatan (contoh: `11.01.01`).
- `regency_code` (VARCHAR(15), Foreign Key): Kode kabupaten/kota induk, merujuk ke `regencies.code`.
- `name` (VARCHAR(255)): Nama lengkap kecamatan (contoh: `Bakongan`).

### 4. Tabel `villages`
Tabel ini menyimpan data desa dan kelurahan, level administrasi terkecil.

- `code` (VARCHAR(25), Primary Key): Kode unik desa/kelurahan (contoh: `11.01.01.2001`).
- `district_code` (VARCHAR(20), Foreign Key): Kode kecamatan induk, merujuk ke `districts.code`.
- `name` (VARCHAR(255)): Nama lengkap desa/kelurahan (contoh: `Keude Bakongan`).

---

## Optimasi (Indeks)

Indeks dibuat untuk mempercepat proses pencarian dan `JOIN` data.
- **Indeks Foreign Key**: Dibuat pada setiap kolom `*_code` (misal: `regencies.province_code`) untuk mempercepat operasi `JOIN` antar tabel.
- **Indeks Nama**: Dibuat pada kolom `name` di setiap tabel untuk mempercepat pencarian wilayah berdasarkan namanya.

---

## Skrip SQL Lengkap

Berikut adalah skrip SQL untuk membuat keseluruhan struktur database yang dijelaskan di atas.

```sql
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
