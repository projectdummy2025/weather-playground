# 🌦️ Weather Playground

> 🧪 Mini eksperimen belajar integrasi **API publik (AccuWeather)** dan parsing **JSON** menggunakan **Express.js**.  
> Proyek ini hanya untuk eksplorasi — bukan untuk produksi.

---

## 🎯 Tujuan Proyek
- Melatih integrasi dengan REST API pihak ketiga  
- Mempelajari autentikasi menggunakan **header `Authorization: Bearer`**  
- Memahami alur: pencarian lokasi → dapatkan `locationKey` → ambil kondisi cuaca  
- Melatih error handling dan parsing JSON aman di backend  

---

## ⚙️ Teknologi yang Digunakan
- **Node.js** (runtime environment)  
- **Express.js** (framework backend)  
- **Axios** (HTTP client untuk request ke API)  
- **AccuWeather API** — *Core Weather: Current Conditions & Location Search*  

---

## 🚀 Fitur Saat Ini
- ✅ Cari cuaca berdasarkan **nama kota** via query parameter  
- ✅ Otomatis:
  1. Cari `locationKey` dari endpoint `/locations/v1/cities/search`
  2. Gunakan `locationKey` untuk ambil data dari `/currentconditions/v1/{key}`
- ✅ Respons JSON berisi:
  - Nama kota (`LocalizedName`)
  - `WeatherText` (kondisi cuaca)
  - Suhu dalam Celsius dan Fahrenheit
  - Waktu observasi lokal (`LocalObservationDateTime`)
  - Status siang/malam (`IsDayTime`)
  - Link ke halaman AccuWeather

> ⚠️ Catatan: Beberapa field seperti `RelativeHumidity` bisa bernilai `null` — ini normal sesuai dokumentasi AccuWeather.

---

## 🧩 Struktur Proyek
```bash
weather-playground/
├── .env                 # Simpan ACCUWEATHER_API_KEY
├── .env.example         # Template untuk .env
├── server.js            # Entry point server Express
├── package.json
└── README.md
```

---

## 🪄 Langkah Instalasi & Penggunaan

### 1️⃣ Kloning Repositori
```bash
git clone https://github.com/username/weather-playground.git
cd weather-playground
```

### 2️⃣ Instal Dependensi
```bash
npm install
```

### 3️⃣ Dapatkan API Key dari AccuWeather
- Buka [https://developer.accuweather.com](https://developer.accuweather.com)
- Buat akun → buat aplikasi baru → salin API Key  
- Pastikan status aplikasi **Active** (kadang perlu klik "Submit")

### 4️⃣ Buat File `.env`
Buat file `.env` di root proyek dan isi dengan API Key Anda.

*Contoh `.env`:*
```env
ACCUWEATHER_API_KEY=abcd1234efgh5678ijkl9012mnop3456
PORT=3000
```
> 💡 Jangan commit `.env`! File ini sudah ada di `.gitignore`.

### 5️⃣ Jalankan Server
```bash
npm start
```
Server akan berjalan di: 👉 `http://localhost:3000`  

---

## 🔍 Cara Menggunakan API

**Endpoint**  
```
GET /weather?city={nama_kota}
```

**Contoh Request**  
```http
GET http://localhost:3000/weather?city=Jakarta
```

**Contoh Respons**  
```json
{
  "city": "Jakarta",
  "locationKey": "208971",
  "weatherText": "Partly sunny",
  "temperatureC": 31,
  "temperatureF": 88,
  "humidity": 74,
  "isDayTime": true,
  "observationTime": "2025-11-06T10:30:00+07:00"
}
```
> 📌 Field seperti `humidity` bisa `null` tergantung lokasi dan data AccuWeather. 

---

## 🧠 Catatan Tambahan
- Semua request ke AccuWeather menggunakan header: `Authorization: Bearer YOUR_API_KEY`
- Error `401` biasanya karena:
    - API key salah/tidak aktif
    - Lupa pakai header (mengandalkan `apikey=...` di URL tidak dijamin bekerja)
- Rate limit: ~50 request/hari untuk akun gratis

---

## 💡 Ide Pengembangan Berikutnya
- 🌍 Tambah endpoint forecast 5 hari: `/forecasts/v1/daily/5day/{key}`
- 📊 Buat tampilan frontend sederhana (HTML + JS)
- ⚡ Implementasi caching `locationKey` (gunakan `Map` atau Redis ringan)
- 📦 Ekspor ke Docker untuk deployment mudah

---

## ✨ Kesan & Catatan   
> Proyek ini seperti melihat langit — kadang cerah, kadang mendung, tapi selalu menarik untuk diamati.
> Tujuan utamanya bukan hanya mengambil data cuaca, tapi melatih ketelitian membaca dokumentasi, pemahaman alur API, dan logika pemrosesan JSON. 

---

© 2025 — Weather Playground | Eksperimen kecil, pelajaran besar.
