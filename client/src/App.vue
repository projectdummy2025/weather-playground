<script setup>
import { ref, onMounted } from 'vue';

const locations = ref([
  { adm4: '31.71.03.1001', name: 'Kemayoran, Jakarta', data: null, error: null },
  { adm4: '32.73.02.1005', name: 'Sekeloa, Bandung', data: null, error: null },
  { adm4: '51.03.01.1001', name: 'Kuta, Bali', data: null, error: null }
]);

const fetchWeather = async (location) => {
  location.data = null;
  location.error = null;
  try {
    const response = await fetch(`/api/cuaca?adm4=${encodeURIComponent(location.adm4)}`);
    const data = await response.json();

    if (response.ok) {
      location.data = data;
    } else {
      location.error = data.error || 'Gagal mengambil data.';
    }
  } catch (error) {
    console.error('Fetch error:', error);
    location.error = 'Gagal terhubung ke server. Pastikan server berjalan dan coba lagi.';
  }
};

onMounted(() => {
  locations.value.forEach(location => fetchWeather(location));
});

const getIconUrl = (imageName) => {
  return imageName ? `https://www.bmkg.go.id/asset/media/web/media/icon/${imageName}` : '';
};
</script>

<template>
  <div id="app">
    <h1>Prakiraan Cuaca BMKG</h1>
    <div class="locations-container">
      <div v-for="location in locations" :key="location.adm4" class="container">
        <div v-if="location.error" class="error">
          <p>Error for {{ location.name }}: {{ location.error }}</p>
        </div>
        <div v-else-if="!location.data" class="loading">
          <p>Mencari data untuk {{ location.name }}...</p>
        </div>
        <div v-else>
          <div class="location-info">
            <h2>{{ location.name }}</h2>
            <p><strong>Kecamatan:</strong> {{ location.data.lokasi.kecamatan || '-' }}</p>
            <p><strong>Koordinat:</strong> {{ location.data.lokasi.lat }}, {{ location.data.lokasi.lon }}</p>
          </div>
          <h3>Prakiraan Cuaca:</h3>
          <div v-if="location.data.prakiraan && location.data.prakiraan.length > 0">
            <div v-for="dayForecast in location.data.prakiraan" :key="dayForecast.hari">
              <h4>{{ dayForecast.hari }}</h4>
              <div class="forecast-grid">
                <div v-for="item in dayForecast.periode" :key="item.local_datetime" class="forecast-card">
                  <h3>{{ new Date(item.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}</h3>
                  <p>
                    <img v-if="item.url_ikon" :src="getIconUrl(item.url_ikon)" :alt="item.weather_desc">
                    <strong>{{ item.weather_desc }}</strong>
                  </p>
                  <p><strong>Suhu:</strong> {{ item.t }}°C</p>
                  <p><strong>Kelembapan:</strong> {{ item.hu }}%</p>
                  <p><strong>Angin:</strong> {{ item.ws }} m/s</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>Tidak ada data prakiraan cuaca.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 2rem;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.locations-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px; /* Adjust as needed for 3 columns */
  box-sizing: border-box;
}

.loading, .error {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
}

.location-info {
  background-color: #e9f7ff;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.location-info h2 {
  margin: 0 0 0.5rem 0;
  color: #0056b3;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Smaller cards for periods */
  gap: 1rem;
}

.forecast-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.forecast-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.forecast-card p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.forecast-card img {
  width: 40px;
  height: 40px;
  display: block;
  margin: 0 auto 5px;
}
</style>