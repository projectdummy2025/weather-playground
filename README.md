# ☁️ Cumulus: Prakiraan Cuaca BMKG (Beta)

> **Cumulus** adalah aplikasi web eksperimental yang dirancang untuk menampilkan prakiraan cuaca dari API publik BMKG. Proyek ini berfungsi sebagai studi kasus untuk integrasi backend Express.js dengan frontend Vue.js yang modern dan responsif menggunakan Tailwind CSS.

---

## 🚀 Gambaran Umum Proyek
Cumulus bertujuan untuk menyajikan data prakiraan cuaca secara intuitif dan efisien. Sebagai proyek tahap beta, fokus utamanya adalah pada konsumsi data dari API BMKG dan penyajiannya dalam antarmuka pengguna yang bersih. Aplikasi ini menunjukkan bagaimana teknologi web modern dapat digunakan untuk membangun aplikasi yang responsif dan mudah digunakan.

---

## ✨ Fitur
- **Tampilan Multi-Lokasi**: Menampilkan prakiraan cuaca untuk beberapa lokasi yang telah ditentukan (saat ini: Kemayoran - Jakarta, Sekeloa - Bandung, Kuta - Bali).
- **UI Modern & Responsif**: Dibangun dengan Vue.js dan Tailwind CSS, antarmuka pengguna dirancang agar bersih, minimalis, dan berfungsi dengan baik di berbagai ukuran perangkat.
- **Prakiraan Per Jam**: Menyajikan detail prakiraan cuaca per jam untuk setiap lokasi, termasuk suhu, kelembapan, kecepatan angin, dan kondisi cuaca.
- **Navigasi Hari Berbasis Tab**: Memungkinkan pengguna untuk dengan mudah beralih antara prakiraan cuaca untuk hari ini, besok, dan lusa melalui antarmuka tab yang intuitif.
- **Backend Proxy Sederhana**: Server Express.js bertindak sebagai proxy untuk mengambil data dari API BMKG, membantu menghindari masalah CORS dan mengelola permintaan API.

---

## 🛠️ Tumpukan Teknologi
### Backend
- **Node.js**: Lingkungan runtime JavaScript.
- **Express.js**: Framework web minimalis untuk Node.js, digunakan untuk membuat API proxy.
- **Axios**: Klien HTTP berbasis Promise untuk browser dan Node.js, digunakan untuk membuat permintaan ke API BMKG.

### Frontend
- **Vue.js 3**: Framework JavaScript progresif untuk membangun antarmuka pengguna.
- **Vite**: Tool build frontend generasi berikutnya yang menyediakan pengalaman pengembangan yang sangat cepat.
- **Tailwind CSS**: Framework CSS utility-first untuk membangun desain kustom dengan cepat.
- **PostCSS & Autoprefixer**: Digunakan oleh Tailwind untuk memproses CSS dan menambahkan prefix vendor.

### API
- **API Publik BMKG**: Sumber data utama untuk prakiraan cuaca di Indonesia (tingkat Kecamatan/Desa).

---

## 🧩 Struktur Proyek
```bash
Cumulus/
├── server/              # Kode backend Express.js
│   └── server.js        # Logika server utama
├── client/              # Kode frontend Vue.js
│   ├── public/          # Aset statis
│   ├── src/             # Kode sumber Vue.js
│   │   ├── App.vue      # Komponen root aplikasi
│   │   ├── main.js      # Titik masuk JavaScript
│   │   └── assets/      # Aset CSS dan lainnya
│   ├── tailwind.config.js # Konfigurasi Tailwind CSS
│   ├── postcss.config.js  # Konfigurasi PostCSS
│   ├── index.html       # File HTML utama
│   ├── package.json     # Dependensi frontend
│   └── vite.config.js   # Konfigurasi Vite
├── .env.example         # Contoh variabel lingkungan
├── package.json         # Dependensi proyek utama (backend)
└── README.md            # Dokumentasi proyek
```

---

## 🚀 Instalasi & Menjalankan Aplikasi

### 1️⃣ Kloning Repositori
```bash
git clone https://github.com/username/Cumulus.git
cd Cumulus
```

### 2️⃣ Instal Dependensi
Proyek ini memiliki dua file `package.json` yang terpisah untuk backend (di root) dan frontend (di `client/`).

```bash
# Instal dependensi untuk server (backend)
npm install

# Instal dependensi untuk aplikasi Vue (frontend)
npm install --prefix client
```

### 3️⃣ Konfigurasi Variabel Lingkungan
Buat file bernama `.env` di **root project** (`/Cumulus/.env`) berdasarkan `.env.example`.

```env
# Port untuk server backend
PORT=3000
```
> 💡 **Penting**: Jangan commit file `.env` Anda ke repositori publik!

### 4️⃣ Jalankan Aplikasi
Aplikasi ini memerlukan dua proses terminal yang berjalan secara bersamaan: satu untuk backend dan satu untuk frontend.

**Terminal 1 (Di folder root `Cumulus/`): Jalankan Server Backend**
```bash
npm start
```
Server Express.js akan berjalan di `http://localhost:3000`.

**Terminal 2 (Di folder root `Cumulus/`): Jalankan Server Pengembangan Frontend**
```bash
npm run dev --prefix client
```
Server pengembangan Vite akan berjalan di `http://localhost:5173` (atau port lain jika 5173 sudah digunakan).

### 5️⃣ Akses Aplikasi
Setelah kedua server berjalan, buka browser Anda dan navigasi ke alamat server frontend: **`http://localhost:5173`**.

---

## 💡 Catatan Pengembangan & Kustomisasi
- **Proxy API**: Frontend Vite dikonfigurasi untuk melakukan proxy permintaan dari `/api/*` ke server backend di `localhost:3000`. Ini diatur dalam `client/vite.config.js`.
- **Kustomisasi Lokasi**: Lokasi cuaca saat ini di-hardcode di dalam `client/src/App.vue`. Anda dapat mengubah atau menambahkan kode `adm4` untuk menampilkan data dari wilayah lain.
- **Status Beta**: Karena ini adalah proyek beta, beberapa fitur mungkin belum lengkap atau dioptimalkan. Feedback dan kontribusi sangat dihargai!

---

## 🤝 Kontribusi
Saran, laporan bug, dan permintaan fitur sangat diterima. Silakan buka issue atau ajukan pull request di repositori GitHub.

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

© 2025 — Cumulus | Eksperimen API BMKG.