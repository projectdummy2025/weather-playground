const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load .env

const app = express();
const PORT = process.env.PORT || 3000;
const BMKG_BASE_URL = process.env.BMKG_BASE_URL || 'https://api.bmkg.go.id/publik';
const BMKG_TIMEOUT = parseInt(process.env.BMKG_TIMEOUT) || 30000; // ms

// --- Fungsi untuk mengambil dan memproses data dari BMKG ---
async function getBmkgForecast(adm4) {
  try {
    const url = `${BMKG_BASE_URL}/prakiraan-cuaca?adm4=${adm4}`;
    console.log("Mengakses URL:", url);

    const response = await axios.get(url, {
      timeout: BMKG_TIMEOUT,
      headers: { 'Accept': 'application/json' }
    });

    console.log("Status respons:", response.status);

    if (response.status !== 200) {
      throw new Error(`API BMKG merespons ${response.status}`);
    }

    // Langsung kembalikan data mentah dari BMKG
    return response.data;

  } catch (error) {
    console.error("Error fetching BMKG data:", error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request ke BMKG timeout.');
    }
    // Lempar error agar bisa ditangani di route handler
    throw error;
  }
}

// --- Routing ---
app.get('/cuaca', async (req, res) => {
  const adm4 = req.query.adm4;

  if (!adm4) {
    return res.status(400).json({
      error: 'Parameter "adm4" wajib disertakan.'
    });
  }

  try {
    const forecastData = await getBmkgForecast(adm4);
    // Kembalikan dalam format JSON mentah
    res.json(forecastData);
  } catch (error) {
    // Tangani error dari fungsi getBmkgForecast
    let statusCode = 500;
    let errorMessage = 'Terjadi kesalahan internal saat mengambil data BMKG.';

    if (error.message.includes('timeout')) {
      statusCode = 504; // Gateway Timeout
      errorMessage = error.message;
    } else if (error.response && error.response.status === 404) {
      statusCode = 404; // Not Found
      errorMessage = `Data untuk wilayah ${adm4} tidak ditemukan. Pastikan kode wilayah benar.`;
    } else if (error.message.includes('404')) {
        statusCode = 404;
        errorMessage = `Data untuk wilayah ${adm4} tidak ditemukan. Pastikan kode wilayah benar.`;
    }

    return res.status(statusCode).json({ error: errorMessage, details: error.message });
  }
});

// --- Jalankan Server ---
app.listen(PORT, () => {
  console.log(`Server BMKG Express berjalan di http://localhost:${PORT}`);
});
