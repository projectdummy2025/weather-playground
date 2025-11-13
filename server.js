const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load .env

const app = express();
app.use(express.static('public'));
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

    if (response.status !== 200) {
      throw new Error(`API BMKG merespons ${response.status}`);
    }

    const rawData = response.data;

    // --- Parsing dan Transformasi Data ---
    // Validasi struktur data yang benar
    if (!rawData || !Array.isArray(rawData.data) || !rawData.data[0] || !Array.isArray(rawData.data[0].cuaca)) {
      throw new Error('Data dari BMKG tidak valid atau memiliki struktur yang tidak diharapkan.');
    }

    const location = rawData.lokasi || {};
    const forecasts = rawData.data[0].cuaca;

    // Mengubah data mentah menjadi format JSON yang lebih bersih dan terstruktur
    const formattedData = {
      lokasi: {
        desa: location.desa || null,
        kecamatan: location.kecamatan || null,
        kota: location.kotkab || null,
        provinsi: location.provinsi || null,
        lat: location.lat || null,
        lon: location.lon || null,
        timezone: location.timezone || null
      },
      prakiraan: forecasts.map((prakiraan_harian, index_hari) => {
        if (!Array.isArray(prakiraan_harian)) return null;

        return {
          hari: `Hari ke-${index_hari + 1}`,
          periode: prakiraan_harian.map(item => ({
            utc_datetime: item.utc_datetime || null,
            local_datetime: item.local_datetime || null,
            t: item.t ? parseFloat(item.t) : null,
            hu: item.hu ? parseInt(item.hu) : null,
            weather_desc: item.weather_desc || null,
            weather_desc_en: item.weather_desc_en || null,
            ws: item.ws ? parseFloat(item.ws) : null,
            wd: item.wd || null,
            tcc: item.tcc ? parseInt(item.tcc) : null,
            vs_text: item.vs_text || null,
            analysis_date: item.analysis_date || null,
            url_ikon: item.image ? item.image.replace(/ /g, '%20') : null
          }))
        };
      }).filter(Boolean) // Menghapus entri null jika ada
    };

    return formattedData;

  } catch (error) {
    console.error("Error fetching or parsing BMKG data:", error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request ke BMKG timeout.');
    }
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
    res.json(forecastData);
  } catch (error) {
    let statusCode = 500;
    let errorMessage = 'Terjadi kesalahan internal saat mengambil data BMKG.';

    if (error.message.includes('timeout')) {
      statusCode = 504;
    } else if (error.response && error.response.status === 404) {
      statusCode = 404;
      errorMessage = `Data untuk wilayah ${adm4} tidak ditemukan.`;
    }

    return res.status(statusCode).json({ error: errorMessage, details: error.message });
  }
});

// --- Jalankan Server ---
app.listen(PORT, () => {
  console.log(`Server BMKG Express berjalan di http://localhost:${PORT}`);
});
