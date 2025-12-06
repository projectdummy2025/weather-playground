<template>
  <section
    id="weather-section"
    class="min-h-screen w-full py-8"
  >
    <div class="container mx-auto px-6 md:px-12">
    <!-- Location Filter Section -->
    <div class="relative z-40 mb-12">
      <div class="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
        <h2 class="text-xl md:text-2xl font-bold text-white font-montserrat mb-6 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Pilih Lokasi
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Province Filter -->
          <div class="relative" data-province-dropdown>
            <div class="relative group">
              <input
                type="text"
                :value="selectedProvince ? provinces.find((p) => p.code === selectedProvince)?.name : provinceSearch"
                @input="emit('update:provinceSearch', $event.target.value); emit('update:provinceDropdownOpen', true)"
                @click="emit('update:provinceDropdownOpen', !provinceDropdownOpen)"
                placeholder="Provinsi..."
                class="w-full px-4 py-3 bg-black/20 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all"
              />
            </div>
            <div v-show="provinceDropdownOpen" class="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
              <ul class="py-2">
                <li v-for="prov in filteredProvinces" :key="prov.code" class="px-4 py-2 text-slate-200 hover:bg-white/10 cursor-pointer" @click="emit('update:selectedProvince', prov.code); emit('update:provinceSearch', prov.name); emit('update:provinceDropdownOpen', false)">
                  {{ prov.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- City Filter -->
          <div class="relative" data-city-dropdown>
            <div class="relative group">
              <input
                type="text"
                :value="selectedCity ? cities.find((c) => c.code === selectedCity)?.name : citySearch"
                @input="emit('update:citySearch', $event.target.value); emit('update:cityDropdownOpen', true)"
                @click="emit('update:cityDropdownOpen', !cityDropdownOpen)"
                :disabled="!selectedProvince"
                placeholder="Kota/Kabupaten..."
                class="w-full px-4 py-3 bg-black/20 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all disabled:opacity-40"
              />
            </div>
            <div v-show="cityDropdownOpen" class="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
              <ul class="py-2">
                <li v-for="city in filteredCities" :key="city.code" class="px-4 py-2 text-slate-200 hover:bg-white/10 cursor-pointer" @click="emit('update:selectedCity', city.code); emit('update:citySearch', city.name); emit('update:cityDropdownOpen', false)">
                  {{ city.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- District Filter -->
          <div class="relative" data-district-dropdown>
            <div class="relative group">
              <input
                type="text"
                :value="selectedDistrict ? districts.find((d) => d.code === selectedDistrict)?.name : districtSearch"
                @input="emit('update:districtSearch', $event.target.value); emit('update:districtDropdownOpen', true)"
                @click="emit('update:districtDropdownOpen', !districtDropdownOpen)"
                :disabled="!selectedCity"
                placeholder="Kecamatan..."
                class="w-full px-4 py-3 bg-black/20 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all disabled:opacity-40"
              />
            </div>
            <div v-show="districtDropdownOpen" class="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
              <ul class="py-2">
                <li v-for="district in filteredDistricts" :key="district.code" class="px-4 py-2 text-slate-200 hover:bg-white/10 cursor-pointer" @click="emit('update:selectedDistrict', district.code); emit('update:districtSearch', district.name); emit('update:districtDropdownOpen', false)">
                  {{ district.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Village Filter -->
          <div class="relative" data-village-dropdown>
            <div class="relative group">
              <input
                type="text"
                :value="villageSearch || (selectedVillage ? villages.find((v) => v.code === selectedVillage)?.name : '')"
                @input="emit('update:villageSearch', $event.target.value); emit('update:villageDropdownOpen', true); emit('update:selectedVillage', '')"
                @click="emit('update:villageDropdownOpen', !villageDropdownOpen)"
                :disabled="!selectedDistrict"
                placeholder="Ketik untuk mencari desa/kelurahan..."
                class="w-full px-4 py-3 bg-black/20 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all disabled:opacity-40"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <div v-show="villageDropdownOpen && filteredVillages.length > 0" class="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
              <ul class="py-2">
                <li v-for="village in filteredVillages" :key="village.code" class="px-4 py-2 text-slate-200 hover:bg-white/10 cursor-pointer transition-colors" @click="emit('update:selectedVillage', village.code); emit('update:villageSearch', village.name); emit('update:villageDropdownOpen', false)">
                  <div class="font-medium">{{ village.name }}</div>
                  <div v-if="village.village_type" class="text-xs text-slate-400 mt-0.5">{{ village.village_type }}</div>
                </li>
              </ul>
            </div>
            <div v-show="villageDropdownOpen && filteredVillages.length === 0 && villageSearch" class="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4">
              <p class="text-sm text-slate-400 text-center">Tidak ada hasil untuk "{{ villageSearch }}"</p>
            </div>
          </div>
        </div>
        
        <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Weather Content -->
    <div v-if="weatherData && selectedLocation && currentWeather" class="max-w-7xl mx-auto text-white">
      
      <!-- A. HEADER SECTION (CONTEXT) -->
      <div class="mb-10 text-center md:text-left animate-fade-in-up">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight font-montserrat mb-2 drop-shadow-lg">
          {{ selectedLocation.location.kecamatan }}
        </h1>
        <h2 class="text-xl md:text-3xl font-medium opacity-90 mb-4">
          {{ selectedLocation.location.kotkab }}
        </h2>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span class="text-sm md:text-base font-medium">{{ selectedLocation.location.provinsi }}</span>
        </div>
      </div>

      <!-- D. WARNING SYSTEM -->
      <div v-if="warningMessage && !warningDismissed" class="mb-10 animate-bounce-in">
        <div class="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-2xl p-1">
          <div class="absolute inset-0 bg-pattern opacity-10"></div>
          <div class="relative bg-black/10 backdrop-blur-sm p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4">
            <div class="p-3 bg-white/20 rounded-full animate-pulse">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg md:text-xl font-bold text-white mb-1">Peringatan Dini Cuaca</h3>
              <p class="text-white/90 font-medium">{{ warningMessage }}</p>
            </div>
            <button @click="dismissWarning" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- B. MAIN HERO SECTION (CURRENT WEATHER) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
        <!-- Primary Element -->
        <div class="flex flex-col items-center lg:items-start animate-fade-in-left">
          <div class="flex items-center gap-6 md:gap-10">
            <div class="relative">
              <div class="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
              <img 
                :src="currentWeather.url_ikon || currentWeather.image" 
                :alt="currentWeather.weather_desc" 
                class="relative w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl floating-animation" 
              />
            </div>
            <div>
              <div class="text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                {{ currentWeather.t }}°
              </div>
              <div class="text-2xl md:text-4xl font-medium capitalize mt-2 text-white/90 font-montserrat">
                {{ currentWeather.weather_desc }}
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary Grid -->
        <div class="grid grid-cols-3 gap-4 animate-fade-in-right">
          <!-- Humidity -->
          <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300 group">
            <div class="text-blue-300 mb-2 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <div class="text-3xl font-bold mb-1">{{ currentWeather.hu }}%</div>
            <div class="text-xs uppercase tracking-wider opacity-70">Kelembaban</div>
          </div>

          <!-- Wind -->
          <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300 group">
            <div class="text-cyan-300 mb-2 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8" :style="{ transform: `rotate(${currentWeather.wind_dir}deg)` }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </div>
            <div class="text-3xl font-bold mb-1 flex items-baseline gap-1">
              {{ currentWeather.wind_speed }} <span class="text-sm font-normal">km/h</span>
            </div>
            <div class="text-xs uppercase tracking-wider opacity-70">Angin</div>
          </div>

          <!-- Visibility -->
          <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300 group">
            <div class="text-emerald-300 mb-2 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <div class="text-3xl font-bold mb-1">{{ currentWeather.vs_text || '10km+' }}</div>
            <div class="text-xs uppercase tracking-wider opacity-70">Visibilitas</div>
          </div>
        </div>
      </div>

      <!-- C. HOURLY SCROLL -->
      <div class="mb-16 animate-fade-in-up delay-200">
        <h3 class="text-xl font-bold mb-6 opacity-90 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Prakiraan 24 Jam
        </h3>
        <div class="relative group">
          <div class="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x px-2">
            <div 
              v-for="(item, index) in hourlyForecast" 
              :key="index" 
              class="flex-shrink-0 w-28 p-4 rounded-3xl backdrop-blur-md border flex flex-col items-center justify-center snap-start transition-all duration-300 hover:scale-105"
              :class="isClosestTime(item.local_datetime) ? 'bg-white/20 border-white/40 ring-2 ring-white/30 shadow-lg scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'"
            >
              <span class="text-sm font-medium opacity-80 mb-3">{{ formatTime(item.local_datetime) }}</span>
              <img :src="item.url_ikon || item.image" class="w-12 h-12 mb-3 object-contain drop-shadow-md" />
              <span class="text-2xl font-bold mb-1">{{ item.t }}°</span>
              <span class="text-xs text-center opacity-60 line-clamp-1 w-full">{{ item.weather_desc }}</span>
            </div>
          </div>
          <!-- Fade effect on sides -->
          <div class="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none rounded-l-3xl"></div>
          <div class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent pointer-events-none rounded-r-3xl"></div>
        </div>
      </div>

      <!-- AI Explanation Section (Restyled) -->
      <div class="mb-16">
         <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold opacity-90">Analisis Cerdas AI</h3>
            <button
              @click="explainForecast"
              :disabled="isExplaining"
              class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-full border border-white/20 transition-all disabled:opacity-50"
            >
              <svg v-if="isExplaining" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {{ isExplaining ? 'Menganalisis...' : 'Jelaskan Cuaca' }}
            </button>
         </div>
         
         <div v-if="explanation" class="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl relative overflow-hidden animate-fade-in-up">
            <div class="absolute top-0 right-0 p-8 opacity-5">
               <svg class="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v3c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
            </div>
            <div class="relative z-10 prose prose-invert prose-lg max-w-none" v-html="renderedExplanation"></div>
         </div>
      </div>

      <!-- Chart Section (Restyled) -->
      <div class="mb-12 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
        <h3 class="text-xl font-bold mb-6 opacity-90">Grafik Tren</h3>
        <div class="h-80 w-full">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>

    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedVillage && !loading" class="flex flex-col items-center justify-center min-h-[60vh] text-center text-white p-6">
      <div class="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 animate-pulse">
        <svg class="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 class="text-3xl font-bold mb-4 font-montserrat">Mulai Eksplorasi Cuaca</h3>
      <p class="text-xl opacity-70 max-w-md">Pilih lokasi di atas untuk melihat prakiraan cuaca yang akurat dan mendetail.</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <div class="relative w-24 h-24 mb-8">
        <div class="absolute inset-0 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div class="absolute inset-4 border-4 border-white/10 border-t-white/50 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <p class="text-xl font-medium animate-pulse">Memuat Data Satelit...</p>
    </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from "vue";
import { marked } from 'marked';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
});

// Register chart components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  // Location data
  provinces: Array,
  cities: Array,
  districts: Array,
  villages: Array,
  // Selected values
  selectedProvince: String,
  selectedCity: String,
  selectedDistrict: String,
  selectedVillage: String,
  // Search values
  provinceSearch: String,
  citySearch: String,
  districtSearch: String,
  villageSearch: String,
  // Filtered data
  filteredProvinces: Array,
  filteredCities: Array,
  filteredDistricts: Array,
  filteredVillages: Array,
  // Dropdown states
  provinceDropdownOpen: Boolean,
  cityDropdownOpen: Boolean,
  districtDropdownOpen: Boolean,
  villageDropdownOpen: Boolean,
  // App state
  weatherData: Object,
  selectedLocation: Object,
  loading: Boolean,
  error: String,
});

const emit = defineEmits([
  "update:selectedProvince",
  "update:selectedCity",
  "update:selectedDistrict",
  "update:selectedVillage",
  "update:provinceSearch",
  "update:citySearch",
  "update:districtSearch",
  "update:villageSearch",
  "update:provinceDropdownOpen",
  "update:cityDropdownOpen",
  "update:districtDropdownOpen",
  "update:villageDropdownOpen",
]);

// --- New Logic for Revamp ---

const currentWeather = computed(() => {
  if (!props.weatherData?.prakiraan?.[0]?.periode?.[0]) return null;
  return props.weatherData.prakiraan[0].periode[0];
});

const hourlyForecast = computed(() => {
  if (!props.weatherData?.prakiraan) return [];
  // Flatten the array as per spec and take first 24 items (approx 24 hours if hourly, or just all)
  return props.weatherData.prakiraan.flatMap(day => day.periode);
});

const warningMessage = ref(null);
const warningDismissed = ref(false);

watch(() => props.weatherData, (newData) => {
  warningDismissed.value = false;
  warningMessage.value = null;
  if (!newData) return;
  
  const keywords = ["Petir", "Hujan Lebat", "Thunderstorm", "Extreme"];
  const allPeriods = newData.prakiraan.flatMap(d => d.periode);
  
  for (const period of allPeriods) {
    const desc = (period.weather_desc || '').toLowerCase();
    const descEn = (period.weather_desc_en || '').toLowerCase();
    
    if (keywords.some(k => desc.includes(k.toLowerCase()) || descEn.includes(k.toLowerCase()))) {
      warningMessage.value = `Peringatan Dini: ${period.weather_desc} diprediksi pada ${formatTime(period.local_datetime)}`;
      break; // Show first warning found
    }
  }
}, { immediate: true });

function dismissWarning() {
  warningDismissed.value = true;
}

function isClosestTime(datetime) {
  if (!datetime) return false;
  const now = new Date();
  const target = new Date(datetime);
  const diff = Math.abs(now - target);
  return diff < 3600000 * 1.5; // Highlight if within 1.5 hours
}

// --- AI Explanation Logic ---
const explanation = ref(null);
const isExplaining = ref(false);

const renderedExplanation = computed(() => {
  if (!explanation.value) return '';
  return marked.parse(explanation.value);
});

async function explainForecast() {
  if (!props.weatherData) return;

  isExplaining.value = true;
  explanation.value = null;

  try {
    const response = await fetch('/api/explain-forecast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.weatherData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Gagal mendapatkan penjelasan.');
    }

    explanation.value = data.explanation;
  } catch (err) {
    console.error('Error explaining forecast:', err);
    explanation.value = "Maaf, terjadi kesalahan saat membuat penjelasan AI. Silakan coba lagi nanti.";
  } finally {
    isExplaining.value = false;
  }
}

// --- Chart Logic ---
const chartRef = ref(null);
let chartInstance = null;

watch(
  () => props.weatherData,
  (newWeatherData) => {
    if (newWeatherData) {
      nextTick(() => {
        updateChart();
      });
    }
  },
  { deep: true }
);

function updateChart() {
  if (!props.weatherData || !chartRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const allPeriods = props.weatherData.prakiraan.flatMap((day) => day.periode);
  // Limit to first 24 points to avoid overcrowding
  const limitedPeriods = allPeriods.slice(0, 24);
  
  const timestamps = limitedPeriods.map((p) => formatTime(p.local_datetime));
  const temperatures = limitedPeriods.map((p) => p.t);
  const humidity = limitedPeriods.map((p) => p.hu);

  const ctx = chartRef.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: timestamps,
      datasets: [
        {
          label: "Suhu (°C)",
          data: temperatures,
          borderColor: "rgba(255, 255, 255, 0.9)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(255, 255, 255, 0.5)",
          pointHoverRadius: 6,
          borderWidth: 3
        },
        {
          label: "Kelembaban (%)",
          data: humidity,
          borderColor: "rgba(56, 189, 248, 0.8)", // Sky blue
          backgroundColor: "rgba(56, 189, 248, 0.05)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(56, 189, 248, 1)",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [5, 5]
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#e2e8f0',
            padding: 15,
            font: {
              size: 12,
              weight: 'bold',
              family: 'Montserrat'
            },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 12,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.6)",
            font: {
              size: 11
            }
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.6)",
            font: {
              size: 11
            }
          },
        },
      },
    },
  });
}

// --- Formatting Functions ---
function formatDay(dateString) {
  if (!dateString) return 'Tanggal tidak tersedia';
  try {
    let date;
    if (dateString.includes('T') || dateString.includes('-')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'T00:00:00');
    }
    if (isNaN(date.getTime())) return dateString;
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    return dateString;
  }
}

function formatTime(dateString) {
  if (!dateString) return '--:--';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const timeMatch = dateString.match(/(\d{2}):(\d{2})/);
      if (timeMatch) return `${timeMatch[1]}:${timeMatch[2]}`;
      return '--:--';
    }
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch (error) {
    return '--:--';
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.floating-animation {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-left {
  animation: fade-in-up 0.8s ease-out forwards; /* Simplified to up for consistency */
}

.animate-fade-in-right {
  animation: fade-in-up 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.delay-200 {
  animation-delay: 0.2s;
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
