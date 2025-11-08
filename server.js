const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({
      error: 'Parameter "city" wajib disertakan.'
    });
  }

  try {
    const headers = {
      'Authorization': `Bearer ${process.env.ACCUWEATHER_API_KEY}`
    };

    // Langkah 1: Cari locationKey
    const searchUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?q=${encodeURIComponent(city)}`;
    const searchRes = await axios.get(searchUrl, { headers });

    if (!Array.isArray(searchRes.data) || searchRes.data.length === 0) {
      return res.status(404).json({
        error: `Kota "${city}" tidak ditemukan di AccuWeather.`
      });
    }

    const location = searchRes.data[0];
    const { Key: locationKey, LocalizedName: cityName } = location;

    // Langkah 2: Ambil kondisi cuaca saat ini
    const weatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}`;
    const weatherRes = await axios.get(weatherUrl, { headers });

    if (!Array.isArray(weatherRes.data) || weatherRes.data.length === 0) {
      return res.status(502).json({
        error: 'Tidak ada data cuaca dari AccuWeather.'
      });
    }

    const current = weatherRes.data[0];

    // Ambil nilai dengan pengecekan null/undefined
    const tempMetric = current.Temperature?.Metric?.Value ?? null;
    const tempImperial = current.Temperature?.Imperial?.Value ?? null;

    const output = {
      city: cityName,
      locationKey,
      weatherText: current.WeatherText || 'N/A',
      temperatureC: tempMetric,
      temperatureF: tempImperial,
      humidity: current.RelativeHumidity ?? 'N/A',
      isDayTime: current.IsDayTime,
      observationTime: current.LocalObservationDateTime,
      link: current.Link || null
    };

    res.json(output);

  } catch (error) {
    // Analisis error spesifik
    if (error.response) {
      // AccuWeather memberi respons tapi dengan status error
      const { status, data } = error.response;
      console.error(`AccuWeather error ${status}:`, data);
      
      if (status === 401) {
        return res.status(401).json({
          error: 'API key tidak valid atau tidak disertakan. Periksa file .env dan header Authorization.'
        });
      } else if (status === 403) {
        return res.status(403).json({
          error: 'Akses ditolak. Pastikan API key sudah diaktifkan di dashboard AccuWeather.'
        });
      }
    } else if (error.request) {
      // Tidak ada respons sama sekali (jaringan/timeout)
      console.error('Tidak ada respons dari AccuWeather:', error.request);
      return res.status(504).json({
        error: 'Gagal terhubung ke AccuWeather. Cek koneksi internet.'
      });
    } else {
      // Error lain (misal: salah kode)
      console.error('Error tidak terduga:', error.message);
    }

    res.status(500).json({
      error: 'Terjadi kesalahan saat mengambil data cuaca.',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});