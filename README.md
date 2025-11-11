# 🌦️ Prakiraan Cuaca BMKG API

> 🧪 Eksperimen integrasi **API publik BMKG** dan parsing **JSON** menggunakan **Express.js**.
> Proyek ini bertujuan untuk menyediakan endpoint backend sederhana yang mengambil dan menyajikan data prakiraan cuaca dari BMKG.

---

## 🎯 Tujuan Proyek
- Melatih integrasi dengan REST API publik tanpa autentikasi kompleks.
- Mempelajari cara mengambil data berdasarkan kode wilayah administratif (`adm4`).
- Memahami alur: request ke API BMKG → parsing JSON → menyajikan data terstruktur.
- Melatih error handling dan parsing JSON yang tidak konvensional di backend.

---

## ⚙️ Teknologi yang Digunakan
- **Node.js** (runtime environment)
- **Express.js** (framework backend)
- **Axios** (HTTP client untuk request ke API)
- **API Publik BMKG** — *Prakiraan Cuaca Indonesia tingkat Kecamatan/Desa*

---

## 🚀 Fitur Saat Ini
- ✅ Ambil data cuaca berdasarkan **kode wilayah (`adm4`)** via query parameter.
- ✅ Parsing dan transformasi respons JSON dari BMKG menjadi format yang lebih bersih dan mudah digunakan.
- ✅ Respons JSON berisi:
  - Informasi detail lokasi (`desa`, `kecamatan`, `kota`, `provinsi`).
  - Data prakiraan cuaca untuk beberapa hari ke depan, terstruktur per hari dan per periode waktu.
  - Detail cuaca per periode: suhu, kelembapan, kondisi cuaca, kecepatan dan arah angin.

---

## 🧩 Struktur Proyek
```bash
Cumulus/
├── .env                 # Simpan konfigurasi opsional (PORT, dll.)
├── .env.example         # Template untuk .env
├── server.js            # Entry point server Express
├── package.json
└── README.md
```

---

## 🪄 Langkah Instalasi & Penggunaan

### 1️⃣ Kloning Repositori
```bash
git clone https://github.com/username/Cumulus.git
cd Cumulus
```

### 2️⃣ Instal Dependensi
```bash
npm install
```

### 3️⃣ Buat File `.env` (Opsional)
API BMKG saat ini tidak memerlukan API Key. File `.env` dapat digunakan untuk mengkonfigurasi port server atau variabel lingkungan lainnya.

*Contoh `.env`:*
```env
PORT=3000
# BMKG_BASE_URL=https://api.bmkg.go.id/publik
# BMKG_TIMEOUT=30000
```
> 💡 Jangan commit `.env`! File ini sudah ada di `.gitignore`.

### 4️⃣ Jalankan Server
```bash
npm start
```
Server akan berjalan di: 👉 `http://localhost:3000` (atau port yang didefinisikan di `.env`).

---

## 🔍 Cara Menggunakan API

**Endpoint**
```
GET /cuaca?adm4={kode_wilayah}
```

**Contoh Request**
Gunakan kode `adm4` untuk wilayah yang diinginkan. Contoh untuk Kemayoran, Jakarta Pusat:
```http
GET http://localhost:3000/cuaca?adm4=31.71.03.1001
```

**Contoh Respons Sukses**
```json
{
  "lokasi": {
    "desa": "Kemayoran",
    "kecamatan": "Kemayoran",
    "kota": "Kota Adm. Jakarta Pusat",
    "provinsi": "DKI Jakarta",
    "lat": -6.1647214778,
    "lon": 106.8453837867,
    "timezone": "Asia/Jakarta"
  },
  "prakiraan": [
    {
      "hari": "Hari ke-1",
      "periode": [
        {
          "utc_datetime": "2025-11-11 00:00:00",
          "local_datetime": "2025-11-11 07:00:00",
          "t": 26,
          "hu": 84,
          "weather_desc": "Berawan",
          "weather_desc_en": "Mostly Cloudy",
          "ws": 4.4,
          "wd": "SW",
          "tcc": 100,
          "vs_text": "< 10 km",
          "analysis_date": "2025-11-10T12:00:00",
          "url_ikon": "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg"
        },
        {
          "utc_datetime": "2025-11-11 03:00:00",
          "local_datetime": "2025-11-11 10:00:00",
          "t": 26,
          "hu": 85,
          "weather_desc": "Hujan Ringan",
          "weather_desc_en": "Light Rain",
          "ws": 4,
          "wd": "N",
          "tcc": 100,
          "vs_text": "< 10 km",
          "analysis_date": "2025-11-10T12:00:00",
          "url_ikon": "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan%20ringan-am.svg"
        }
      ]
    }
  ]
}
```

---

## 🧠 Catatan Tambahan
- API publik BMKG tidak memerlukan *API key*.
- Struktur data JSON dari BMKG bisa jadi tidak konvensional (misalnya, properti `data` yang berisi objek, bukan array di beberapa kasus). Kode di `server.js` sudah dirancang untuk menangani struktur yang kita temukan.
- Kode wilayah (`adm4`) bisa didapatkan dari sumber data pemerintah seperti Kepmendagri.

---

## 💡 Ide Pengembangan Berikutnya
- 🌍 Tambah endpoint untuk mencari kode `adm4` berdasarkan nama wilayah.
- 📊 Buat tampilan frontend sederhana (HTML + JS) untuk menampilkan data cuaca.
- ⚡ Implementasi caching untuk mengurangi jumlah request ke API BMKG.
- 📦 Konfigurasi Docker untuk deployment yang lebih mudah.

---

© 2025 — Cumulus | Eksperimen API BMKG.
