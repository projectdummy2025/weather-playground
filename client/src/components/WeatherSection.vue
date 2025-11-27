<template>
  <section id="weather-section" class="container mx-auto px-4 lg:px-8 py-6">
    <!-- Location Filter Section -->
    <div class="mb-8">
      <div
        class="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white font-montserrat">
            Pilih Lokasi Anda
          </h2>
          <!-- Direct Search Input -->
          <div class="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Cari lokasi langsung..."
              class="w-full pl-10 pr-4 py-2 bg-slate-700/60 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            />
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Province Filter -->
          <div class="relative" data-province-dropdown>
            <label class="block text-sm font-medium text-slate-300 mb-1"
              >Provinsi</label
            >
            <div class="relative">
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
                class="w-full px-3 py-2 bg-slate-700/60 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div
              v-show="provinceDropdownOpen"
              class="absolute z-20 w-full mt-1 bg-slate-700/90 backdrop-blur-xl border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
            >
              <ul class="py-1">
                <li
                  v-for="prov in filteredProvinces"
                  :key="prov.code"
                  class="px-3 py-2 text-white hover:bg-slate-600/80 rounded-md cursor-pointer"
                  @click="
                    emit('update:selectedProvince', prov.code);
                    emit('update:provinceSearch', prov.name);
                    emit('update:provinceDropdownOpen', false);
                  "
                >
                  {{ prov.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- City Filter -->
          <div class="relative" data-city-dropdown>
            <label class="block text-sm font-medium text-slate-300 mb-1"
              >Kota/Kabupaten</label
            >
            <div class="relative">
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
                class="w-full px-3 py-2 bg-slate-700/60 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div
              v-show="cityDropdownOpen"
              class="absolute z-20 w-full mt-1 bg-slate-700/90 backdrop-blur-xl border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
            >
              <ul class="py-1">
                <li
                  v-for="city in filteredCities"
                  :key="city.code"
                  class="px-3 py-2 text-white hover:bg-slate-600/80 rounded-md cursor-pointer"
                  @click="
                    emit('update:selectedCity', city.code);
                    emit('update:citySearch', city.name);
                    emit('update:cityDropdownOpen', false);
                  "
                >
                  {{ city.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- District Filter -->
          <div class="relative" data-district-dropdown>
            <label class="block text-sm font-medium text-slate-300 mb-1"
              >Kecamatan</label
            >
            <div class="relative">
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
                class="w-full px-3 py-2 bg-slate-700/60 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div
              v-show="districtDropdownOpen"
              class="absolute z-20 w-full mt-1 bg-slate-700/90 backdrop-blur-xl border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
            >
              <ul class="py-1">
                <li
                  v-for="district in filteredDistricts"
                  :key="district.code"
                  class="px-3 py-2 text-white hover:bg-slate-600/80 rounded-md cursor-pointer"
                  @click="
                    emit('update:selectedDistrict', district.code);
                    emit('update:districtSearch', district.name);
                    emit('update:districtDropdownOpen', false);
                  "
                >
                  {{ district.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Village Filter -->
          <div class="relative" data-village-dropdown>
            <label class="block text-sm font-medium text-slate-300 mb-1"
              >Kelurahan/Desa</label
            >
            <div class="relative">
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
                class="w-full px-3 py-2 bg-slate-700/60 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div
              v-show="villageDropdownOpen"
              class="absolute z-20 w-full mt-1 bg-slate-700/90 backdrop-blur-xl border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
            >
              <ul class="py-1">
                <li
                  v-for="village in filteredVillages"
                  :key="village.code"
                  class="px-3 py-2 text-white hover:bg-slate-600/80 rounded-md cursor-pointer"
                  @click="
                    emit('update:selectedVillage', village.code);
                    emit('update:villageSearch', village.name);
                    emit('update:villageDropdownOpen', false);
                  "
                >
                  {{ village.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          v-if="error"
          class="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200"
        >
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Weather Data Section -->
    <div v-if="weatherData && selectedLocation">
      <!-- Location Header -->
      <div
        class="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5 mb-6"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 class="text-2xl font-semibold text-white font-montserrat">
              {{ selectedLocation.name }}
            </h3>
            <p class="text-slate-300 text-sm">
              {{ selectedLocation.location.kecamatan }},
              {{ selectedLocation.location.kotkab }},
              {{ selectedLocation.location.provinsi }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
            >
              Kode: {{ selectedVillage }}
            </span>
          </div>
        </div>
      </div>

      <!-- Temperature/Humidity Timeline Chart -->
      <div
        class="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-5 mb-6"
      >
        <h3 class="text-lg font-semibold text-white mb-4 font-montserrat">
          Timeline Suhu & Kelembaban
        </h3>
        <div class="h-80 w-full">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>

      <!-- Weather Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Today's Summary, Current Weather, Humidity, Temp Range cards... -->
        <!-- These will be restyled to look more like Apple's weather app widgets -->
        <div
          class="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-4 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center gap-3 mb-3 text-slate-400">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
              <h4 class="font-medium uppercase text-xs">Suhu Saat Ini</h4>
            </div>
            <p class="text-4xl font-bold text-white">
              {{ weatherData.prakiraan[0]?.periode[0]?.t }}°C
            </p>
          </div>
          <p class="text-sm text-slate-300 mt-1 capitalize">
            {{ weatherData.prakiraan[0]?.periode[0]?.weather_desc }}
          </p>
        </div>

        <div
          class="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-4 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center gap-3 mb-3 text-slate-400">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <h4 class="font-medium uppercase text-xs">Rentang Suhu</h4>
            </div>
            <p class="text-2xl font-semibold text-white">
              {{
                Math.min(
                  ...weatherData.prakiraan[0]?.periode.map((p) => p.t)
                )
              }}° /
              {{
                Math.max(
                  ...weatherData.prakiraan[0]?.periode.map((p) => p.t)
                )
              }}°
            </p>
          </div>
          <p class="text-sm text-slate-400 mt-1">Min / Maks Hari Ini</p>
        </div>

        <div
          class="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-4 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center gap-3 mb-3 text-slate-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 6.34L21.36 18H2.64L12 6.34M12 4L0 20h24L12 4z"
                ></path>
              </svg>
              <h4 class="font-medium uppercase text-xs">Arah Angin</h4>
            </div>
            <p class="text-2xl font-semibold text-white">
              {{ weatherData.prakiraan[0]?.periode[0]?.wind_dir }}
            </p>
          </div>
          <p class="text-sm text-slate-400 mt-1">
            Kecepatan {{ weatherData.prakiraan[0]?.periode[0]?.wind_speed }}
            knot
          </p>
        </div>

        <div
          class="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-4 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center gap-3 mb-3 text-slate-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 9.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zM20 18.5c0 .28-.22.5-.5.5h-15a.5.5 0 01-.5-.5c0-.28.22-.5.5-.5h15c.28 0 .5.22.5.5zM3.5 16h17a.5.5 0 00.5-.5c0-.28-.22-.5-.5-.5H3c-.28 0-.5.22-.5.5s.22.5.5.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                ></path>
              </svg>
              <h4 class="font-medium uppercase text-xs">Kelembaban</h4>
            </div>
            <p class="text-4xl font-bold text-white">
              {{ weatherData.prakiraan[0]?.periode[0]?.hu }}%
            </p>
          </div>
          <p class="text-sm text-slate-400 mt-1">Tingkat kelembaban udara</p>
        </div>
      </div>

      <!-- Detailed Forecast Section -->
      <div
        class="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-5"
      >
        <h3 class="text-lg font-semibold text-white mb-4 font-montserrat">
          Prakiraan Harian
        </h3>

        <div class="space-y-2">
          <div
            v-for="(day) in weatherData.prakiraan"
            :key="day.hari"
            class="p-2 -mx-2 rounded-lg hover:bg-slate-700/30 transition-colors"
          >
            <h4 class="font-medium text-slate-200 mb-3 text-lg">
              {{ formatDay(day.hari) }}
            </h4>

            <div class="overflow-x-auto scrollbar-hide">
              <div class="flex gap-3 pb-2">
                <div
                  v-for="(period) in day.periode"
                  :key="period.local_datetime"
                  class="bg-slate-700/30 border border-slate-600/40 p-3 rounded-xl flex flex-col items-center flex-shrink-0 w-28"
                >
                  <p class="text-sm font-medium text-slate-300 text-center mb-1">
                    {{ formatTime(period.local_datetime) }}
                  </p>
                  <div class="w-12 h-12 mb-1 flex items-center justify-center">
                    <img
                      :src="period.url_ikon"
                      :alt="period.weather_desc"
                      class="w-10 h-10 object-contain"
                    />
                  </div>
                  <p class="text-xl font-bold text-center text-white">
                    {{ period.t }}°
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedVillage" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div
          class="w-16 h-16 bg-slate-700/40 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-slate-500"
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
        <h3 class="text-lg font-medium text-slate-300 mb-2">Pilih Lokasi</h3>
        <p class="text-slate-500">
          Gunakan filter di atas untuk memilih provinsi, kota, kecamatan, dan
          kelurahan/desa yang Anda inginkan.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center py-12">
      <div
        class="w-12 h-12 border-4 border-slate-700/40 border-t-blue-500 rounded-full animate-spin mx-auto"
      ></div>
      <p class="text-slate-400 mt-4">Memuat data cuaca...</p>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
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
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(100, 116, 139, 0.2)",
          },
          ticks: {
            color: "#94a3b8",
          },
        },
        y: {
          grid: {
            color: "rgba(100, 116, 139, 0.2)",
          },
          ticks: {
            color: "#94a3b8",
          },
        },
      },
    },
  });
}

// --- Formatting Functions ---
function formatDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
