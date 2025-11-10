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
  const url = `${BMKG_BASE_URL}/prakiraan-cuaca?adm4=${encodeURIComponent(adm4)}`;
  console.log("Mengakses URL:", url);

  const response = await axios.get(url, {
    timeout: BMKG_TIMEOUT,
    headers: { 'Accept': 'application/json' }
  });

  console.log("Status respons:", response.status);
  console.log("Respons mentah dari BMKG:", response.data); // Tambahkan log ini!

  if (response.status !== 200) {
    throw new Error(`API BMKG merespons ${response.status}`);
  }

  const data = response.data;

  // --- Periksa struktur data ---
  console.log("Struktur data:", {
    hasStatus: 'status' in data,
    statusValue: data.status,
    hasData: 'data' in data,
    dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
    hasLokasi: 'lokasi' in data
  });

  if (data.status !== 200 || !data.data || !Array.isArray(data.data)) {
    throw new Error('Data dari BMKG tidak valid atau kosong.');
  }
    const location = data.lokasi || {};
    const forecasts = data.data[0]?.cuaca || [];

    if (!Array.isArray(forecasts)) {
      throw new Error('Struktur data prakiraan cuaca tidak ditemukan.');
    }

    // Format data seperti yang dilakukan di PHP
    const formattedData = {
      location: {
        village: location.desa || null,
        district: location.kecamatan || null,
        city: location.kotkab || null,
        province: location.provinsi || null,
        lat: location.lat || null,
        lon: location.lon || null,
        timezone: location.timezone || null
      },
      forecasts: forecasts.map((hari, idx) => ({
        dayIndex: idx + 1,
        periods: Array.isArray(hari) ? hari.map(item => ({
          localDatetime: item.local_datetime || null,
          weatherDescription: item.weather_desc || null,
          iconUrl: item.image ? item.image.replace(/ /g, '%20') : null, // Proses URL gambar seperti PHP
          temperatureC: item.t ? parseFloat(item.t) : null,
          humidity: item.hu ? parseInt(item.hu) : null,
          windSpeedKmh: item.ws ? parseFloat(item.ws) : null,
          windDirection: item.wd || null,
          visibility: item.vs_text || null
        })) : []
      }))
    };

    return formattedData;

  } catch (error) {
    console.error("Error fetching BMKG data:", error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request ke BMKG timeout.');
    }
    throw error; // Lempar error agar bisa ditangani di route handler
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
    // Kembalikan dalam format JSON seperti yang biasa kamu lakukan
    res.json(forecastData);
  } catch (error) {
    // Tangani error dari fungsi getBmkgForecast
    if (error.message.includes('timeout')) {
      return res.status(504).json({ error: error.message });
    }
    if (error.message.includes('404') || error.message.includes('tidak ditemukan')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Terjadi kesalahan internal saat mengambil data BMKG.', details: error.message });
  }
});

// --- Jalankan Server ---
app.listen(PORT, () => {
  console.log(`Server BMKG Express berjalan di http://localhost:${PORT}`);
});
