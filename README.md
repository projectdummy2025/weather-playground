# Cumulus

Cumulus adalah aplikasi web monitoring cuaca yang menyediakan prakiraan cuaca untuk seluruh wilayah Indonesia. Aplikasi ini menggunakan data resmi dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) dan dilengkapi dengan fitur analisis cuaca berbasis AI.

## Tentang Proyek

Proyek ini dibangun sebagai solusi untuk mengakses informasi cuaca Indonesia dengan antarmuka yang modern dan mudah digunakan. Pengguna dapat memilih lokasi secara hierarkis mulai dari provinsi hingga tingkat desa, kemudian mendapatkan prakiraan cuaca yang akurat untuk lokasi tersebut.

### Fitur Utama

- Prakiraan cuaca real-time dari BMKG untuk seluruh Indonesia
- Filter lokasi bertingkat (Provinsi, Kota/Kabupaten, Kecamatan, Desa)
- Pencarian lokasi dengan sistem autocomplete
- Visualisasi data cuaca dalam bentuk grafik
- Analisis cuaca menggunakan AI
- Sistem peringatan dini untuk kondisi cuaca ekstrem
- Tampilan responsif untuk berbagai ukuran layar

### Teknologi

**Frontend**
- Vue.js 3
- Vite
- Tailwind CSS
- Chart.js

**Backend**
- Node.js
- Express.js
- MySQL

**Integrasi**
- BMKG Public API
- OpenRouter (AI)

## Menjalankan Proyek Secara Lokal

### Prasyarat

Pastikan sistem Anda telah terinstal:

- Node.js versi 20.19.0 atau lebih baru
- MySQL Server
- Git

### Langkah Instalasi

1. Clone repository

```bash
git clone https://github.com/projectdummy2025/weather-playground.git
cd weather-playground
```

2. Siapkan database

Buat database MySQL baru, kemudian import skema dan data lokasi Indonesia:

```bash
mysql -u root -p < documentation/import.sql
```

3. Konfigurasi environment

Buat file `.env` di folder `backend` dengan isi sebagai berikut:

```
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
BMKG_BASE_URL=https://api.bmkg.go.id/publik
BMKG_TIMEOUT=45000
BMKG_CACHE_TTL=900
CACHE_TTL=3600
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

5. Jalankan aplikasi

Buka dua terminal terpisah:

Terminal pertama untuk backend:
```bash
cd backend
npm run dev
```

Terminal kedua untuk frontend:
```bash
cd frontend
npm run dev
```

6. Akses aplikasi

Buka browser dan akses `http://localhost:5173`

## Struktur Proyek

```
cumulus/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── services/
│   │   └── aiService.js
│   ├── utils/
│   │   └── cache.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── weather/
│   │   │   └── ...
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
└── documentation/
```

## Demo

Coming soon.

## Lisensi

Hak cipta dilindungi. Proyek ini dibuat untuk keperluan pembelajaran dan demonstrasi.

## Kontak

Untuk pertanyaan atau masukan, silakan buat issue di repository ini.
