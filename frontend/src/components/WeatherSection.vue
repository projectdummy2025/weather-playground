<template>
  <section id="weather-section" class="container mx-auto px-4 lg:px-8 py-6">
    <!-- Location Filter Section -->
    <div class="relative z-40 mb-8">
      <div class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-white font-montserrat mb-6">
          Pilih Lokasi Anda
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Province Filter -->
          <div class="relative" data-province-dropdown>
            <label class="block text-sm font-semibold text-slate-200 mb-2">
              Provinsi
            </label>
            <div class="relative group">
              <input
                type="text"
                :value="
                  selectedProvince
                    ? provinces.find((p) => p.code === selectedProvince)?.name
                    : provinceSearch
                "
                @input="
                  emit('update:provinceSearch', $event.target.value);
                  emit('update:provinceDropdownOpen', true);
                "
                @click="emit('update:provinceDropdownOpen', !provinceDropdownOpen)"
                placeholder="Pilih atau cari provinsi..."
                class="w-full px-4 py-3 bg-slate-700/50 text-white rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all group-hover:border-slate-500/70"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': provinceDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <div
              v-show="provinceDropdownOpen"
              class="absolute z-30 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 rounded-lg shadow-2xl max-h-64 overflow-y-auto custom-scrollbar"
            >
              <ul class="py-2">
                <li
                  v-for="prov in filteredProvinces"
                  :key="prov.code"
                  class="px-4 py-2.5 text-slate-200 hover:bg-blue-600/20 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"
                  @click="
                    emit('update:selectedProvince', prov.code);
                    emit('update:provinceSearch', prov.name);
                    emit('update:provinceDropdownOpen', false);
                  "
                >
                  <span class="w-1 h-1 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {{ prov.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- City Filter -->
          <div class="relative" data-city-dropdown>
            <label class="block text-sm font-semibold text-slate-200 mb-2">
              Kota/Kabupaten
            </label>
            <div class="relative group">
              <input
                type="text"
                :value="
                  selectedCity
                    ? cities.find((c) => c.code === selectedCity)?.name
                    : citySearch
                "
                @input="
                  emit('update:citySearch', $event.target.value);
                  emit('update:cityDropdownOpen', true);
                "
                @click="emit('update:cityDropdownOpen', !cityDropdownOpen)"
                :disabled="!selectedProvince"
                placeholder="Pilih atau cari kota..."
                class="w-full px-4 py-3 bg-slate-700/50 text-white rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed placeholder-slate-400 transition-all group-hover:border-slate-500/70"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': cityDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <div
              v-show="cityDropdownOpen"
              class="absolute z-30 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 rounded-lg shadow-2xl max-h-64 overflow-y-auto custom-scrollbar"
            >
              <ul class="py-2">
                <li
                  v-for="city in filteredCities"
                  :key="city.code"
                  class="px-4 py-2.5 text-slate-200 hover:bg-emerald-600/20 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"
                  @click="
                    emit('update:selectedCity', city.code);
                    emit('update:citySearch', city.name);
                    emit('update:cityDropdownOpen', false);
                  "
                >
                  <span class="w-1 h-1 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {{ city.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- District Filter -->
          <div class="relative" data-district-dropdown>
            <label class="block text-sm font-semibold text-slate-200 mb-2">
              Kecamatan
            </label>
            <div class="relative group">
              <input
                type="text"
                :value="
                  selectedDistrict
                    ? districts.find((d) => d.code === selectedDistrict)?.name
                    : districtSearch
                "
                @input="
                  emit('update:districtSearch', $event.target.value);
                  emit('update:districtDropdownOpen', true);
                "
                @click="
                  emit('update:districtDropdownOpen', !districtDropdownOpen)
                "
                :disabled="!selectedCity"
                placeholder="Pilih atau cari kecamatan..."
                class="w-full px-4 py-3 bg-slate-700/50 text-white rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed placeholder-slate-400 transition-all group-hover:border-slate-500/70"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': districtDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <div
              v-show="districtDropdownOpen"
              class="absolute z-30 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 rounded-lg shadow-2xl max-h-64 overflow-y-auto custom-scrollbar"
            >
              <ul class="py-2">
                <li
                  v-for="district in filteredDistricts"
                  :key="district.code"
                  class="px-4 py-2.5 text-slate-200 hover:bg-purple-600/20 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"
                  @click="
                    emit('update:selectedDistrict', district.code);
                    emit('update:districtSearch', district.name);
                    emit('update:districtDropdownOpen', false);
                  "
                >
                  <span class="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {{ district.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Village Filter -->
          <div class="relative" data-village-dropdown>
            <label class="block text-sm font-semibold text-slate-200 mb-2">
              Kelurahan/Desa
            </label>
            <div class="relative group">
              <input
                type="text"
                :value="
                  selectedVillage
                    ? villages.find((v) => v.code === selectedVillage)?.name
                    : villageSearch
                "
                @input="
                  emit('update:villageSearch', $event.target.value);
                  emit('update:villageDropdownOpen', true);
                "
                @click="emit('update:villageDropdownOpen', !villageDropdownOpen)"
                :disabled="!selectedDistrict"
                placeholder="Pilih atau cari kelurahan..."
                class="w-full px-4 py-3 bg-slate-700/50 text-white rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed placeholder-slate-400 transition-all group-hover:border-slate-500/70"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': villageDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <div
              v-show="villageDropdownOpen"
              class="absolute z-30 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 rounded-lg shadow-2xl max-h-64 overflow-y-auto custom-scrollbar"
            >
              <ul class="py-2">
                <li
                  v-for="village in filteredVillages"
                  :key="village.code"
                  class="px-4 py-2.5 text-slate-200 hover:bg-amber-600/20 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"
                  @click="
                    emit('update:selectedVillage', village.code);
                    emit('update:villageSearch', village.name);
                    emit('update:villageDropdownOpen', false);
                  "
                >
                  <span class="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {{ village.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          v-if="error"
          class="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/40 rounded-xl text-red-200 flex items-start gap-3"
        >
          <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>

    <!-- Weather Data Section -->
    <div v-if="weatherData && selectedLocation">
      <!-- Location Header -->
      <div class="mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v4m-4-4l-1 1m9-1l1 1M5 13H1m18 0h4M8 12L7 11m9 1l1-1m-7 0v-4m0 0a9 9 0 11-9 9h9a9 9 0 01-9-9z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-white font-montserrat">
                {{ selectedLocation.name }}
              </h3>
              <p class="text-slate-300 text-sm mt-1">
                {{ selectedLocation.location.kecamatan }}, {{ selectedLocation.location.kotkab }}, {{ selectedLocation.location.provinsi }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="px-4 py-2 bg-slate-700/60 backdrop-blur-sm text-slate-300 text-xs font-medium rounded-full border border-slate-600/40"
            >
              Kode: {{ selectedVillage }}
            </span>
            <button
              @click="explainForecast"
              :disabled="isExplaining"
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isExplaining" class="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ isExplaining ? 'Menganalisis...' : 'Jelaskan dengan AI' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Weather Cards Section -->
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Current Temperature Card -->
        <div class="text-center md:text-left">
          <div class="mb-4">
            <h4 class="font-semibold uppercase text-sm font-medium text-orange-300">Suhu Saat Ini</h4>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-white mb-2">
            {{ weatherData.prakiraan[0]?.periode[0]?.t }}°
          </p>
          <p class="text-sm text-slate-300 capitalize">
            {{ weatherData.prakiraan[0]?.periode[0]?.weather_desc }}
          </p>
        </div>

        <!-- Temperature Range Card -->
        <div class="text-center md:text-left">
          <div class="mb-4">
            <h4 class="font-semibold uppercase text-sm font-medium text-blue-300">Rentang Suhu</h4>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-white mb-2">
            {{ Math.min(...weatherData.prakiraan[0]?.periode.map((p) => p.t)) }}° / 
            {{ Math.max(...weatherData.prakiraan[0]?.periode.map((p) => p.t)) }}°
          </p>
          <p class="text-sm text-slate-400">Min / Maks Hari Ini</p>
        </div>

        <!-- Wind Direction Card -->
        <div class="text-center md:text-left">
          <div class="mb-4">
            <h4 class="font-semibold uppercase text-sm font-medium text-cyan-300">Arah Angin</h4>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-white mb-2">
            {{ weatherData.prakiraan[0]?.periode[0]?.wind_dir }}
          </p>
          <p class="text-sm text-slate-400">
            Kecepatan {{ weatherData.prakiraan[0]?.periode[0]?.wind_speed }} knot
          </p>
        </div>

        <!-- Humidity Card -->
        <div class="text-center md:text-left">
          <div class="mb-4">
            <h4 class="font-semibold uppercase text-sm font-medium text-teal-300">Kelembaban</h4>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-white mb-2">
            {{ weatherData.prakiraan[0]?.periode[0]?.hu }}%
          </p>
          <p class="text-sm text-slate-400">Tingkat kelembaban udara</p>
        </div>
      </div>

      <!-- AI Explanation Section -->
      <div v-if="explanation" class="mb-8 p-6 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 rounded-2xl relative overflow-hidden ai-explanation-card">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <svg class="w-32 h-32 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v3c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
        </div>
        <div class="relative z-10">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-indigo-500/30 to-violet-500/30 rounded-xl shadow-lg">
                <svg class="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-indigo-100 font-montserrat">Analisis Cuaca AI</h3>
            </div>
            <button
              @click="explanation = null"
              class="p-1.5 hover:bg-indigo-500/20 rounded-lg transition-colors group"
              title="Tutup"
            >
              <svg class="w-4 h-4 text-indigo-300 group-hover:text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            class="ai-content prose prose-invert prose-sm max-w-none leading-relaxed"
            v-html="renderedExplanation"
          ></div>
        </div>
      </div>

      <!-- Temperature/Humidity Timeline Chart -->
      <div class="my-12">
        <h3 class="text-xl md:text-2xl font-bold text-white font-montserrat mb-6">
          Timeline Suhu & Kelembaban
        </h3>
        <div class="h-80 w-full">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>

      <!-- Detailed Forecast Section -->
      <div class="my-12">
        <h3 class="text-xl md:text-2xl font-bold text-white font-montserrat mb-6">
          Prakiraan Harian
        </h3>

        <div class="space-y-6">
          <div
            v-for="(day, index) in weatherData.prakiraan"
            :key="day.hari"
            class="group"
          >
            <div class="mb-4">
              <h4 class="font-bold text-slate-100 text-lg">
                {{ formatDay(day.hari) }}
              </h4>
            </div>

            <div class="overflow-x-auto pb-2 custom-scrollbar">
              <div class="flex gap-3">
                <div
                  v-for="(period) in day.periode"
                  :key="period.local_datetime"
                  class="p-4 flex flex-col items-center flex-shrink-0 w-32 bg-slate-800/50 border border-slate-700/80 rounded-xl"
                >
                  <p class="text-sm font-semibold text-slate-300 mb-2">
                    {{ formatTime(period.local_datetime) }}
                  </p>
                  <div class="w-14 h-14 mb-2 flex items-center justify-center">
                    <img
                      :src="period.url_ikon"
                      :alt="period.weather_desc"
                      class="w-12 h-12 object-contain drop-shadow-lg"
                    />
                  </div>
                  <p class="text-2xl font-bold text-white mb-1">
                    {{ period.t }}°
                  </p>
                  <p class="text-xs text-slate-400 text-center line-clamp-2 capitalize">
                    {{ period.weather_desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedVillage" class="text-center py-16">
      <div class="max-w-md mx-auto">
        <div
          class="w-20 h-20 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <svg
            class="w-10 h-10 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-200 mb-3 font-montserrat">Pilih Lokasi Anda</h3>
        <p class="text-slate-400 leading-relaxed">
          Gunakan filter di atas untuk memilih provinsi, kota, kecamatan, dan kelurahan/desa untuk melihat prakiraan cuaca.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center py-16">
      <div class="relative w-16 h-16 mx-auto mb-6">
        <div
          class="absolute inset-0 border-4 border-slate-700/40 border-t-blue-500 rounded-full animate-spin"
        ></div>
        <div class="absolute inset-2 border-4 border-slate-700/20 border-t-purple-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <p class="text-slate-300 font-medium">Memuat data cuaca...</p>
      <p class="text-slate-500 text-sm mt-2">Mohon tunggu sebentar</p>
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

const explanation = ref(null);
const isExplaining = ref(false);

// Computed property to render markdown
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
  const timestamps = allPeriods.map((p) => formatTime(p.local_datetime));
  const temperatures = allPeriods.map((p) => p.t);
  const humidity = allPeriods.map((p) => p.hu);

  const ctx = chartRef.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: timestamps,
      datasets: [
        {
          label: "Suhu (°C)",
          data: temperatures,
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.2)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#f97316",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
        },
        {
          label: "Kelembaban (%)",
          data: humidity,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
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
              weight: 'bold'
            },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#e2e8f0',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(100, 116, 139, 0.15)",
            drawBorder: false
          },
          ticks: {
            color: "#94a3b8",
            font: {
              size: 11
            }
          },
        },
        y: {
          grid: {
            color: "rgba(100, 116, 139, 0.15)",
            drawBorder: false
          },
          ticks: {
            color: "#94a3b8",
            font: {
              size: 11
            }
          },
        },
      },
    },
  });
}

// --- Formatting Functions (FIXED) ---
function formatDay(dateString) {
  // Handle various date formats from BMKG API
  if (!dateString) return 'Tanggal tidak tersedia';
  
  try {
    // Try parsing the date string
    let date;
    
    // Check if it's already a valid ISO string or parseable format
    if (dateString.includes('T') || dateString.includes('-')) {
      date = new Date(dateString);
    } else {
      // If it's just a date like "2024-11-27", append time to make it valid
      date = new Date(dateString + 'T00:00:00');
    }
    
    // Validate the date
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return dateString; // Return original string if parsing fails
    }
    
    // Manual Indonesian formatting to ensure 'Senin, 28 Desember 2025' format
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${monthName} ${year}`;
  } catch (error) {
    console.error('Error formatting day:', error, dateString);
    return dateString;
  }
}

function formatTime(dateString) {
  if (!dateString) return '--:--';
  
  try {
    // Parse the datetime string
    const date = new Date(dateString);
    
    // Validate the date
    if (isNaN(date.getTime())) {
      // Try alternative parsing for BMKG format
      // Example: "2024-11-27 13:00:00" or "20241127130000"
      const timeMatch = dateString.match(/(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }
      
      console.warn('Invalid time:', dateString);
      return '--:--';
    }
    
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting time:', error, dateString);
    return '--:--';
  }
}
</script>

<style scoped>
/* Custom scrollbar for dropdowns and horizontal scrolls */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Animation delay for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animation-delay-150 {
  animation-delay: 150ms;
}

/* Line clamp for weather description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4f46e5 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4f46e5;
  border-radius: 3px;
  border: 1px solid transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #4338ca;
}

/* AI Content Styling */
.ai-explanation-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-content {
  color: #e0e7ff;
  font-size: 0.935rem;
  line-height: 1.7;
}

/* Headings */
.ai-content :deep(h1),
.ai-content :deep(h2),
.ai-content :deep(h3),
.ai-content :deep(h4),
.ai-content :deep(h5),
.ai-content :deep(h6) {
  color: #c7d2fe;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-family: 'Montserrat', sans-serif;
  line-height: 1.3;
}

.ai-content :deep(h1) { font-size: 1.5rem; }
.ai-content :deep(h2) { font-size: 1.35rem; }
.ai-content :deep(h3) { font-size: 1.2rem; }
.ai-content :deep(h4) { font-size: 1.1rem; }

.ai-content :deep(h1):first-child,
.ai-content :deep(h2):first-child,
.ai-content :deep(h3):first-child {
  margin-top: 0;
}

/* Paragraphs */
.ai-content :deep(p) {
  margin-bottom: 1em;
  color: #e0e7ff;
}

.ai-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* Strong and Emphasis */
.ai-content :deep(strong),
.ai-content :deep(b) {
  color: #a5b4fc;
  font-weight: 700;
}

.ai-content :deep(em),
.ai-content :deep(i) {
  color: #c7d2fe;
  font-style: italic;
}

/* Lists */
.ai-content :deep(ul),
.ai-content :deep(ol) {
  margin: 1em 0;
  padding-left: 1.75rem;
  color: #e0e7ff;
}

.ai-content :deep(li) {
  margin-bottom: 0.5em;
  padding-left: 0.25em;
}

.ai-content :deep(ul li) {
  list-style-type: none;
  position: relative;
}

.ai-content :deep(ul li)::before {
  content: "•";
  color: #818cf8;
  font-weight: bold;
  font-size: 1.2em;
  position: absolute;
  left: -1.25rem;
}

.ai-content :deep(ol li) {
  list-style-type: decimal;
  color: #e0e7ff;
}

.ai-content :deep(ol li)::marker {
  color: #818cf8;
  font-weight: 600;
}

/* Nested Lists */
.ai-content :deep(li > ul),
.ai-content :deep(li > ol) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

/* Blockquotes */
.ai-content :deep(blockquote) {
  margin: 1.5em 0;
  padding: 1rem 1.25rem;
  border-left: 4px solid #6366f1;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 0.5rem;
  color: #c7d2fe;
  font-style: italic;
}

.ai-content :deep(blockquote p) {
  margin: 0;
}

/* Code */
.ai-content :deep(code) {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  padding: 0.2em 0.4em;
  border-radius: 0.375rem;
  font-size: 0.875em;
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: 500;
}

.ai-content :deep(pre) {
  background: rgba(30, 27, 75, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  margin: 1.5em 0;
  overflow-x: auto;
}

.ai-content :deep(pre code) {
  background: transparent;
  padding: 0;
  border-radius: 0;
  color: #e0e7ff;
  font-size: 0.875rem;
}

/* Links */
.ai-content :deep(a) {
  color: #818cf8;
  text-decoration: underline;
  text-decoration-color: rgba(129, 140, 248, 0.4);
  text-underline-offset: 2px;
  transition: all 0.2s ease;
}

.ai-content :deep(a:hover) {
  color: #a5b4fc;
  text-decoration-color: rgba(165, 180, 252, 0.6);
}

/* Horizontal Rule */
.ai-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(99, 102, 241, 0.3);
  margin: 2em 0;
}

/* Tables */
.ai-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  background: rgba(30, 27, 75, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
}

.ai-content :deep(th),
.ai-content :deep(td) {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
}

.ai-content :deep(th) {
  background: rgba(99, 102, 241, 0.2);
  color: #c7d2fe;
  font-weight: 700;
}

.ai-content :deep(tr:last-child td) {
  border-bottom: none;
}

.ai-content :deep(tr:hover) {
  background: rgba(99, 102, 241, 0.1);
}

</style>
