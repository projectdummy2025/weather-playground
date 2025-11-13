<script setup>
import { ref, onMounted, computed } from 'vue';

const locations = ref([
  { adm4: '31.71.03.1001', name: 'Kemayoran, Jakarta', data: null, error: null, selectedDay: 0 },
  { adm4: '32.73.02.1005', name: 'Sekeloa, Bandung', data: null, error: null, selectedDay: 0 },
  { adm4: '51.03.01.1001', name: 'Kuta, Bali', data: null, error: null, selectedDay: 0 }
]);

const isLoading = computed(() => locations.value.some(loc => !loc.data && !loc.error));

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

const selectDay = (location, dayIndex) => {
  location.selectedDay = dayIndex;
};

const getDayName = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'long', timeZone: 'Asia/Jakarta' };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

const refreshLocation = (location) => {
  fetchWeather(location);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-poppins">
    <!-- Header Section -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
      <div class="container mx-auto px-6 lg:px-8 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <h1 class="text-3xl font-bold text-slate-900 tracking-tight font-montserrat">Cumulus</h1>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div v-if="isLoading" class="flex items-center gap-2 text-sm text-slate-500 mr-2">
              <svg class="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200/60">
              <div class="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v3c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <span class="text-xs font-medium text-slate-600 tracking-wide">Powered by BMKG</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 lg:px-8 py-6">
      <div class="space-y-4">
        <!-- Location Card -->
        <article v-for="location in locations" :key="location.adm4"
          class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-md">

          <!-- Loading State -->
          <div v-if="!location.data && !location.error" class="p-12 text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
              <svg class="animate-spin h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-sm text-slate-600">{{ location.name }}</p>
          </div>

          <!-- Error State -->
          <div v-if="location.error" class="p-8">
            <div class="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center">
              <div class="inline-flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mb-3">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-base font-semibold text-slate-900 mb-1">{{ location.name }}</p>
              <p class="text-sm text-slate-500 mb-4">{{ location.error }}</p>
              <button @click="refreshLocation(location)" 
                class="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors">
                Coba Lagi
              </button>
            </div>
          </div>

          <!-- Success State -->
          <div v-if="location.data">
            <!-- Location Header -->
            <div class="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-8">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <p class="text-sm text-slate-400 font-medium tracking-wide uppercase">{{ location.data.lokasi.kecamatan }}</p>
                  </div>
                  <h2 class="text-3xl font-semibold tracking-tight font-montserrat">{{ location.name }}</h2>
                </div>
                <button @click="refreshLocation(location)" 
                  class="p-2 hover:bg-white/10 rounded-xl transition-colors" 
                  title="Refresh data">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- Day Navigation Tabs -->
              <nav class="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                <button v-for="(day, index) in location.data.prakiraan" 
                  :key="day.hari" 
                  @click="selectDay(location, index)"
                  :class="[
                    'flex-shrink-0 px-5 py-3 text-sm font-semibold rounded-full transition-all duration-200',
                    location.selectedDay === index
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]">
                  <div class="flex flex-col items-center gap-1">
                    <span>{{ getDayName(day.periode[0].local_datetime) }}</span>
                    <span class="text-xs opacity-70">{{ getFormattedDate(day.periode[0].local_datetime) }}</span>
                  </div>
                </button>
              </nav>

              <!-- Weather Forecast Grid -->
              <div v-if="location.data.prakiraan[location.selectedDay]" 
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <div v-for="item in location.data.prakiraan[location.selectedDay].periode" 
                  :key="item.local_datetime"
                  class="group bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl hover:bg-white hover:border-slate-300 transition-all duration-200">
                  
                  <!-- Time -->
                  <div class="mb-3">
                    <p class="text-sm text-slate-500 text-center font-semibold mb-1">
                      {{ new Date(item.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                    </p>
                  </div>
                  
                  <!-- Weather Icon -->
                  <div class="flex justify-center mb-3">
                    <img v-if="item.url_ikon" 
                      :src="getIconUrl(item.url_ikon)" 
                      :alt="item.weather_desc" 
                      class="w-16 h-16 object-contain">
                  </div>
                  
                  <!-- Weather Description -->
                  <p class="text-xs text-slate-600 text-center capitalize mb-4 leading-relaxed">
                    {{ item.weather_desc.toLowerCase() }}
                  </p>
                  
                  <!-- Weather Stats -->
                  <div class="space-y-2 pt-3 border-t border-slate-200/60">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span class="text-xs text-slate-500">Suhu</span>
                      </div>
                      <span class="text-base font-semibold text-slate-900">{{ item.t }}°</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span class="text-xs text-slate-500">Kelembaban</span>
                      </div>
                      <span class="text-base font-semibold text-slate-900">{{ item.hu }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white/50 backdrop-blur-xl border-t border-slate-200/60 mt-8">
      <div class="container mx-auto px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-slate-500">
          Data dari 
          <a href="https://www.bmkg.go.id" target="_blank" rel="noopener" class="text-slate-700 font-semibold hover:text-slate-900 transition-colors">
            BMKG
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-poppins {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.font-montserrat {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth focus rings for accessibility */
button:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}
</style>