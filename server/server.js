const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors
const compression = require('compression'); // Import compression middleware
const http = require('http');
const https = require('https');
require('dotenv').config(); // Load .env
const path = require('path'); // Import path module
const { db, cache } = require('./config/database'); // Import database configuration and cache

// Create axios instance with optimized defaults for BMKG API
const bmkgAxios = axios.create({
  timeout: parseInt(process.env.BMKG_TIMEOUT) || 45000, // Use environment variable or default 45s
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Cumulus-Weather-App/1.0' // Some APIs respond better with user agent
  },
  // Enable keep-alive to reuse connections
  httpAgent: http.Agent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 50,
    maxFreeSockets: 10,
  }),
  httpsAgent: https.Agent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 50,
    maxFreeSockets: 10,
  })
});

const app = express();

// Apply middleware for performance optimization
app.use(compression()); // Compress all responses
app.use(express.json({ limit: '10mb' })); // Handle larger JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Handle larger URL-encoded payloads

// API endpoint for location search
app.get('/api/search-location', async (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    if (!query || query.length < 2) {
        return res.json([]);
    }

    // Create cache key
    const cacheKey = `search:${query}`;

    try {
        // Try to get from cache first
        let results = cache.get(cacheKey);

        if (results) {
            console.log(`Cache hit for query: ${query}`);
            return res.json(results);
        }

        console.log(`Cache miss for query: ${query}, querying database...`);

        // Query database if not in cache
        const [dbResults] = await db.execute(
            'SELECT code, name FROM villages WHERE LOWER(name) LIKE ? LIMIT 20',
            [`%${query}%`]
        );

        // Store in cache for future requests (use TTL from environment, default 1 hour)
        results = dbResults;
        const cacheTTL = parseInt(process.env.CACHE_TTL) || 3600;
        cache.set(cacheKey, results, cacheTTL);

        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to search locations.' });
    }
});

// API endpoint to get all location data for client-side caching
app.get('/api/all-locations', async (req, res) => {
    const cacheKey = 'all-locations';

    try {
        // Try to get from cache first
        let allLocations = cache.get(cacheKey);

        if (allLocations) {
            console.log('Cache hit for all locations');
            return res.json(allLocations);
        }

        console.log('Cache miss for all locations, querying database...');

        // Query database for all villages (the searchable data)
        const [dbResults] = await db.execute(
            'SELECT code, name FROM villages ORDER BY name'
        );

        // Store in cache for 30 minutes (1800 seconds) as requested
        allLocations = dbResults;
        cache.set(cacheKey, allLocations, 1800); // 30 minutes in seconds

        res.json(allLocations);
    } catch (error) {
        console.error('Database query error for all locations:', error);
        res.status(500).json({ error: 'Failed to retrieve all locations.' });
    }
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use(cors()); // Enable CORS for all routes

const PORT = process.env.PORT || 3000;

// Serve static files from the Vue.js build directory
app.use(express.static(path.join(__dirname, '..', 'client/dist')));

// --- Fungsi untuk mengambil dan memproses data dari BMKG ---
async function getBmkgForecast(adm4) {
  // Create cache key for this specific adm4 code
  const cacheKey = `bmkg:${adm4}`;
  const cacheTTL = parseInt(process.env.BMKG_CACHE_TTL) || 900; // Cache for 15 minutes (900 seconds) - weather data freshness

  // Try to get from cache first
  let cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for BMKG data: ${adm4}`);
    return cachedData;
  }

  console.log(`Cache miss for BMKG data: ${adm4}, fetching from API...`);

  try {
    const BMKG_BASE_URL = process.env.BMKG_BASE_URL || 'https://api.bmkg.go.id/publik';
    const url = `${BMKG_BASE_URL}/prakiraan-cuaca?adm4=${adm4}`;

    const response = await bmkgAxios.get(url);

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
    // Optimized parsing - only include necessary fields to reduce response size
    // Prioritize first few days since they're most relevant for users
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
      // Only return the first 3 days of forecast (most relevant) to reduce payload
      prakiraan: forecasts
        .slice(0, 3) // Take only first 3 days to reduce data transfer
        .map((prakiraan_harian, index_hari) => {
          if (!Array.isArray(prakiraan_harian)) return null;

          // Only include essential weather data to reduce payload size
          return {
            hari: `Hari ke-${index_hari + 1}`,
            periode: prakiraan_harian.map(item => ({
              local_datetime: item.local_datetime || null,
              t: item.t ? parseFloat(item.t) : null,        // temperature
              hu: item.hu ? parseInt(item.hu) : null,       // humidity
              weather_desc: item.weather_desc || null,      // weather description
              weather_desc_en: item.weather_desc_en || null, // weather desc in English
              url_ikon: item.image ? item.image.replace(/ /g, '%20') : null // weather icon
            })).filter(item => item.local_datetime !== null) // Remove entries without datetime
          };
        })
        .filter(Boolean) // Menghapus entri null jika ada
    };

    // Store in cache for 15 minutes to avoid repeated API calls
    cache.set(cacheKey, formattedData, cacheTTL);
    console.log(`BMKG data cached for ${adm4} with TTL ${cacheTTL}s`);

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
app.get('/api/cuaca', async (req, res) => {
  console.log('API route /api/cuaca hit'); // <-- ADDED FOR DEBUGGING
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

// Catch-all route to serve the Vue.js index.html for any other requests
app.get(/.*/, (req, res) => {
  console.log('Catch-all route hit'); // <-- ADDED FOR DEBUGGING
  res.sendFile(path.join(__dirname, '..', 'client/dist', 'index.html'));
});

// --- Jalankan Server ---
app.listen(PORT, () => {
  console.log(`Server BMKG Express berjalan di http://localhost:${PORT}`);
});