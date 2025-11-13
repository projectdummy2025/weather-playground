# 🌦️ Prakiraan Cuaca BMKG API (Simplified)

> 🧪 Eksperimen belajar integrasi **API publik BMKG** dan menampilkan data **JSON** menggunakan **Express.js** (backend) dan **Vue.js** (frontend).

---

## 🎯 Tujuan Proyek
- Menjalankan backend Express.js untuk mengambil data dari BMKG.
- Menjalankan frontend Vue.js untuk memicu permintaan API dan menampilkan data mentah.
- Memastikan koneksi dasar antara frontend dan backend berfungsi.

---

## ⚙️ Teknologi yang Digunakan
- **Node.js** (runtime environment)
- **Express.js** (framework backend)
- **Axios** (HTTP client untuk request ke API)
- **Vue.js 3** (framework frontend)
- **Vite** (build tool untuk frontend)
- **API Publik BMKG** — *Prakiraan Cuaca Indonesia tingkat Kecamatan/Desa*

---

## 🧩 Struktur Proyek
```bash
Cumulus/
├── .env                 # Konfigurasi variabel lingkungan (PORT, BMKG_BASE_URL)
├── src/                 # Folder untuk kode backend Node.js (sebelumnya server.js)
│   └── server.js        # Logika server Express.js
├── client/              # Folder untuk kode frontend Vue.js
│   ├── public/
│   ├── src/
│   │   ├── App.vue      # File utama aplikasi Vue.js
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── ...
├── package.json         # Konfigurasi proyek backend dan scripts
└── README.md            # Dokumentasi proyek ini
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
npm install # Untuk dependensi backend
npm install --prefix client # Untuk dependensi frontend
```

### 3️⃣ Konfigurasi File `.env`
Buat file bernama `.env` di **root project** (`/home/ubuntu/Experiment/Cumulus/.env`). Isi dengan konten berikut (jangan ubah `BMKG_BASE_URL` kecuali ada perubahan dari BMKG):

```env
PORT=3000
BMKG_BASE_URL="https://api.bmkg.go.id/publik"
```
> 💡 Jangan commit `.env`! File ini sudah ada di `.gitignore`.

### 4️⃣ Build Aplikasi Frontend
Sebelum menjalankan server, Anda perlu melakukan build untuk aplikasi Vue.js:
```bash
npm run build
```
Ini akan membuat bundle produksi di `client/dist/`.

### 5️⃣ Jalankan Server Backend
```bash
npm start
```
Server akan berjalan di: 👉 `http://localhost:3000` (atau port yang didefinisikan di `.env`).

---

## 🔍 Cara Menggunakan Aplikasi (Frontend)

1.  Setelah server berjalan (`npm start`), buka browser Anda dan navigasi ke `http://localhost:3000`.
2.  Anda akan melihat halaman sederhana dengan sebuah tombol "Fetch Weather".
3.  Klik tombol tersebut. Aplikasi akan memanggil API backend (`/api/cuaca`) untuk mengambil data cuaca untuk Kemayoran.
4.  Data JSON mentah dari BMKG akan ditampilkan langsung di halaman. Jika ada error, pesan error akan ditampilkan.

---

## 🧠 Catatan Tambahan & Debugging
- Jika Anda melihat pesan error "Failed to connect to the server" di browser, atau server tidak merespons, periksa *terminal Anda* tempat `npm start` berjalan. Server memiliki log detail yang akan membantu dalam diagnosis.
- Endpoint API backend sekarang adalah `GET /api/cuaca?adm4={kode_wilayah}`. Frontend saat ini menggunakan `adm4=31.71.03.1001` (Kemayoran) secara hardcode.

---

© 2025 — Cumulus | Eksperimen API BMKG.