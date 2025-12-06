<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import HeroSection from "./components/HeroSection.vue";
import AboutSection from "./components/AboutSection.vue";
import FaqSection from "./components/FaqSection.vue";
import WeatherSection from "./components/WeatherSection.vue";
import Footer from "./components/Footer.vue";

// Reactive variables
const selectedProvince = ref("");
const selectedCity = ref("");
const selectedDistrict = ref("");
const selectedVillage = ref("");
const selectedLocation = ref(null);
const weatherData = ref(null);
const loading = ref(false);
const error = ref(null);

// Location data
const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const villages = ref([]);

// Search functionality
const provinceSearch = ref("");
const citySearch = ref("");
const districtSearch = ref("");
const villageSearch = ref("");

// Filtered location data for search
const filteredProvinces = ref([]);
const filteredCities = ref([]);
const filteredDistricts = ref([]);
const filteredVillages = ref([]);

// Dropdown open states
const provinceDropdownOpen = ref(false);
const cityDropdownOpen = ref(false);
const districtDropdownOpen = ref(false);
const villageDropdownOpen = ref(false);

// Fetch provinces when component is mounted
onMounted(async () => {
  await fetchProvinces();
  // Initialize filtered arrays
  filterProvinces();

  // Add click outside listener to close dropdowns
  document.addEventListener("click", handleClickOutside);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Handle clicks outside dropdowns to close them
function handleClickOutside(event) {
  const target = event.target;

  // Close province dropdown if clicking outside
  if (!target.closest("[data-province-dropdown]")) {
    provinceDropdownOpen.value = false;
  }

  // Close city dropdown if clicking outside
  if (!target.closest("[data-city-dropdown]")) {
    cityDropdownOpen.value = false;
  }

  // Close district dropdown if clicking outside
  if (!target.closest("[data-district-dropdown]")) {
    districtDropdownOpen.value = false;
  }

  // Close village dropdown if clicking outside
  if (!target.closest("[data-village-dropdown]")) {
    villageDropdownOpen.value = false;
  }
}

// Watch for changes in selected filters and load corresponding data
watch(selectedProvince, async () => {
  if (selectedProvince.value) {
    await fetchCities(selectedProvince.value);
    selectedCity.value = "";
    selectedDistrict.value = "";
    selectedVillage.value = "";
    weatherData.value = null;
    selectedLocation.value = null;
    citySearch.value = "";
    districtSearch.value = "";
    villageSearch.value = "";
  } else {
    cities.value = [];
    districts.value = [];
    villages.value = [];
    weatherData.value = null;
    selectedLocation.value = null;
    citySearch.value = "";
    districtSearch.value = "";
    villageSearch.value = "";
  }
  filterProvinces(); // Update filtered provinces
});

watch(selectedCity, async () => {
  if (selectedCity.value) {
    await fetchDistricts(selectedCity.value);
    selectedDistrict.value = "";
    selectedVillage.value = "";
    weatherData.value = null;
    selectedLocation.value = null;
    districtSearch.value = "";
    villageSearch.value = "";
  } else {
    districts.value = [];
    villages.value = [];
    weatherData.value = null;
    selectedLocation.value = null;
    districtSearch.value = "";
    villageSearch.value = "";
  }
  filterCities(); // Update filtered cities
});

watch(selectedDistrict, async () => {
  if (selectedDistrict.value) {
    await fetchVillages(selectedDistrict.value);
    selectedVillage.value = "";
    weatherData.value = null;
    selectedLocation.value = null;
    villageSearch.value = "";
  } else {
    villages.value = [];
    weatherData.value = null;
    selectedLocation.value = null;
    villageSearch.value = "";
  }
  filterDistricts(); // Update filtered districts
});

watch(selectedVillage, async () => {
  if (selectedVillage.value) {
    await fetchWeatherData(selectedVillage.value);
  } else {
    weatherData.value = null;
    selectedLocation.value = null;
  }
});

// Watch for changes in search inputs and filter the corresponding data
watch(provinceSearch, () => {
  filterProvinces();
});

watch(citySearch, () => {
  filterCities();
});

watch(districtSearch, () => {
  filterDistricts();
});

watch(villageSearch, () => {
  filterVillages();
});

// Fetch provinces from the API
async function fetchProvinces() {
  try {
    loading.value = true;
    const response = await fetch("/api/provinces");
    const data = await response.json();
    provinces.value = data;
  } catch (err) {
    console.error("Error fetching provinces:", err);
    error.value = "Gagal memuat provinsi";
  } finally {
    loading.value = false;
  }
}

// Fetch cities based on selected province
async function fetchCities(provinceCode) {
  try {
    loading.value = true;
    const response = await fetch(`/api/cities?province=${provinceCode}`);
    const data = await response.json();
    cities.value = data;
    citySearch.value = ""; // Clear search when loading new data
    filterCities(); // Update filtered cities
  } catch (err) {
    console.error("Error fetching cities:", err);
    error.value = "Gagal memuat kota/kabupaten";
  } finally {
    loading.value = false;
  }
}

// Fetch districts based on selected city
async function fetchDistricts(cityCode) {
  try {
    loading.value = true;
    const response = await fetch(`/api/districts?city=${cityCode}`);
    const data = await response.json();
    districts.value = data;
    districtSearch.value = ""; // Clear search when loading new data
    filterDistricts(); // Update filtered districts
  } catch (err) {
    console.error("Error fetching districts:", err);
    error.value = "Gagal memuat kecamatan";
  } finally {
    loading.value = false;
  }
}

// Fetch villages based on selected district
async function fetchVillages(districtCode) {
  try {
    loading.value = true;
    const response = await fetch(`/api/villages?district=${districtCode}`);
    const data = await response.json();
    villages.value = data;
    villageSearch.value = ""; // Clear search when loading new data
    filterVillages(); // Update filtered villages
  } catch (err) {
    console.error("Error fetching villages:", err);
    error.value = "Gagal memuat kelurahan/desa";
  } finally {
    loading.value = false;
  }
}

// Fetch weather data for selected village
async function fetchWeatherData(villageCode) {
  try {
    loading.value = true;
    error.value = null;

    const response = await fetch(
      `/api/cuaca?adm4=${encodeURIComponent(villageCode)}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal mengambil data cuaca");
    }

    weatherData.value = data;
    selectedLocation.value = {
      code: villageCode,
      name: data.lokasi.desa || data.lokasi.kecamatan,
      location: {
        desa: data.lokasi.desa,
        kecamatan: data.lokasi.kecamatan,
        kotkab: data.lokasi.kota,
        provinsi: data.lokasi.provinsi,
      },
    };
  } catch (err) {
    console.error("Error fetching weather data:", err);
    error.value = err.message;
    weatherData.value = null;
    selectedLocation.value = null;
  } finally {
    loading.value = false;
  }
}

// Filter locations based on search input
function filterProvinces() {
  if (!provinceSearch.value.trim()) {
    filteredProvinces.value = provinces.value;
  } else {
    filteredProvinces.value = provinces.value.filter((prov) =>
      prov.name.toLowerCase().includes(provinceSearch.value.toLowerCase())
    );
  }
}

function filterCities() {
  if (!citySearch.value.trim()) {
    filteredCities.value = cities.value;
  } else {
    filteredCities.value = cities.value.filter((city) =>
      city.name.toLowerCase().includes(citySearch.value.toLowerCase())
    );
  }
}

function filterDistricts() {
  if (!districtSearch.value.trim()) {
    filteredDistricts.value = districts.value;
  } else {
    filteredDistricts.value = districts.value.filter((dist) =>
      dist.name.toLowerCase().includes(districtSearch.value.toLowerCase())
    );
  }
}

function filterVillages() {
  if (!villageSearch.value.trim()) {
    filteredVillages.value = villages.value;
  } else {
    filteredVillages.value = villages.value.filter((vill) =>
      vill.name.toLowerCase().includes(villageSearch.value.toLowerCase())
    );
  }
}
// Handle village selection from HeroSection
function handleVillageSelected(village) {
  // Set the selected village code. This will trigger the watcher to fetch weather data.
  // Note: We are not setting province/city/district here, so the dropdowns might remain empty.
  // This is acceptable for the "random village" feature as the priority is showing the weather.
  selectedVillage.value = village.code;
}
</script>

<template>
  <div
    class="min-h-screen bg-slate-900 font-sans text-slate-100"
  >
    <!-- Header Section -->
    <header
      class="bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/30 sticky top-0 z-50"
    >
      <div class="container mx-auto px-6 md:px-12 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <h1
                class="text-2xl font-bold text-white tracking-tight font-montserrat"
              >
                Cumulus
              </h1>
              <p class="text-xs text-slate-400">Sistem Monitoring Cuaca</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div
              v-if="loading"
              class="flex items-center gap-2 text-sm text-slate-300 mr-2"
            >
              <svg
                class="animate-spin h-4 w-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading...</span>
            </div>
            <div
              class="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-full border border-slate-700/40"
            >
              <div
                class="w-5 h-5 bg-slate-700/60 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-3 h-3 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2L2 7v3c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                  />
                </svg>
              </div>
              <span class="text-xs font-medium text-slate-300">BMKG</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <HeroSection @village-selected="handleVillageSelected" />

      <WeatherSection
        :provinces="provinces"
        :cities="cities"
        :districts="districts"
        :villages="villages"
        v-model:selectedProvince="selectedProvince"
        v-model:selectedCity="selectedCity"
        v-model:selectedDistrict="selectedDistrict"
        v-model:selectedVillage="selectedVillage"
        v-model:provinceSearch="provinceSearch"
        v-model:citySearch="citySearch"
        v-model:districtSearch="districtSearch"
        v-model:villageSearch="villageSearch"
        :filteredProvinces="filteredProvinces"
        :filteredCities="filteredCities"
        :filteredDistricts="filteredDistricts"
        :filteredVillages="filteredVillages"
        v-model:provinceDropdownOpen="provinceDropdownOpen"
        v-model:cityDropdownOpen="cityDropdownOpen"
        v-model:districtDropdownOpen="districtDropdownOpen"
        v-model:villageDropdownOpen="villageDropdownOpen"
        :weatherData="weatherData"
        :selectedLocation="selectedLocation"
        :loading="loading"
        :error="error"
      />

      <AboutSection />
      <FaqSection />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap");

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-sans {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
}

.font-montserrat {
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

/* Smooth focus rings for accessibility */
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Custom chart tooltip styling */
.chartjs-tooltip {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.5);
  color: #e2e8f0;
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>