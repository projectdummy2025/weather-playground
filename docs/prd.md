# Product Requirements Document (PRD)

## 1. Latar Belakang
Website prakiraan cuaca umumnya menyajikan data mentah (suhu, peluang hujan, angin) yang sulit diterjemahkan menjadi keputusan praktis. Pengguna utama di Indonesia sering terdampak hujan mendadak, terutama dalam aktivitas harian seperti bepergian dengan motor atau bekerja di luar ruangan.

Produk ini bertujuan menyediakan informasi cuaca berbasis data BMKG yang langsung dapat digunakan untuk mengambil keputusan, khususnya terkait waktu aman dan berisiko untuk beraktivitas.

---

## 2. Tujuan Produk
- Membantu pengguna menentukan waktu aman untuk beraktivitas di luar ruangan pada hari yang sama.
- Menerjemahkan data cuaca BMKG menjadi informasi yang mudah dipahami dan relevan secara praktis.
- Membangun kepercayaan pengguna melalui transparansi antara prakiraan dan realisasi.

---

## 3. Target Pengguna
Pengguna utama:
- Pengendara motor harian.
- Pekerja lapangan ringan (kurir, teknisi, surveyor).
- Individu yang sering keluar-masuk rumah untuk aktivitas harian.

Karakteristik:
- Tidak tertarik pada detail meteorologi teknis.
- Membutuhkan jawaban cepat: kapan aman, kapan berisiko.

---

## 4. Permasalahan Utama Pengguna
- Sulit menentukan jam pasti hujan akan turun.
- Prakiraan cuaca sering terasa tidak sesuai dengan kondisi lokal.
- Data cuaca tersedia, tetapi tidak menjawab kebutuhan pengambilan keputusan.

---

## 5. Solusi yang Ditawarkan
Produk menyajikan prakiraan cuaca berbasis lokasi dengan fokus pada dampak aktivitas, bukan angka teknis.

Fokus utama:
- Klasifikasi waktu harian menjadi jam aman, jam risiko ringan, dan jam risiko tinggi.
- Penjelasan singkat berbasis bahasa awam mengenai kondisi cuaca.
- Riwayat perbandingan prakiraan dan realisasi hari sebelumnya.

---

## 6. Fitur Inti

### 6.1 Jam Aman vs Jam Risiko
- Visualisasi rentang waktu harian:
  - Aman beraktivitas
  - Risiko ringan
  - Risiko tinggi hujan
- Rentang waktu diperbarui setiap hari berdasarkan data BMKG.

### 6.2 Ringkasan Cuaca Harian
- Narasi satu paragraf pendek.
- Menghindari istilah teknis.
- Fokus pada konsekuensi praktis bagi aktivitas luar ruangan.

### 6.3 Riwayat Prakiraan vs Realisasi
- Menampilkan perbandingan prediksi hari sebelumnya dengan kondisi aktual.
- Digunakan untuk membangun kepercayaan, bukan klaim akurasi berlebihan.

---

## 7. Data dan Integrasi
- Sumber data utama: API resmi BMKG.
- Data yang digunakan:
  - Prakiraan hujan per jam.
  - Intensitas hujan.
  - Data awan dan angin dasar (opsional).

---

## 8. Kebutuhan Non-Fungsional
- Waktu muat cepat pada koneksi seluler.
- Tampilan mobile-first.
- Tidak memerlukan akun pengguna.
- Toleran terhadap keterbatasan akurasi data.

---

## 9. Teknologi
- Frontend: Next.js (App Router).
- Styling: CSS Modules atau Tailwind CSS.
- Data fetching: Server Actions atau API Routes.
- Deployment: Platform yang mendukung edge atau serverless.

---

## 12. Ruang Lingkup yang Tidak Termasuk
- Prediksi jangka panjang lebih dari 7 hari.
- Personalisasi berbasis akun pengguna.
- Notifikasi push pada versi awal.
- Integrasi dengan data cuaca non-BMKG.

---

## 13. Metode Evaluasi Keberhasilan
- Pengguna dapat menentukan waktu aman beraktivitas dalam kurang dari 10 detik.
- Tingkat kebingungan pengguna terhadap informasi cuaca berkurang.
- Retensi penggunaan harian untuk cek cuaca pagi.

---

## 13. Risiko dan Mitigasi
- Risiko: Prakiraan meleset.
  - Mitigasi: Transparansi data dan penjelasan konteks.
- Risiko: Overkompleksitas fitur.
  - Mitigasi: Fokus pada tiga fitur inti.

---

## 15. Kesimpulan
Produk ini bukan sekadar website cuaca, melainkan alat bantu pengambilan keputusan berbasis cuaca harian. Nilai utama terletak pada interpretasi dan relevansi, bukan kecanggihan teknologi.

