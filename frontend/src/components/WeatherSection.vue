<template>
  <section
    id="weather-section"
    class="min-h-screen w-full py-4 sm:py-8"
  >
    <div class="container mx-auto px-4 sm:px-6 md:px-12">
      <!-- Location Filter Section -->
      <LocationFilter
        :provinces="provinces"
        :cities="cities"
        :districts="districts"
        :villages="villages"
        :selectedProvince="selectedProvince"
        :selectedCity="selectedCity"
        :selectedDistrict="selectedDistrict"
        :selectedVillage="selectedVillage"
        :provinceSearch="provinceSearch"
        :citySearch="citySearch"
        :districtSearch="districtSearch"
        :villageSearch="villageSearch"
        :filteredProvinces="filteredProvinces"
        :filteredCities="filteredCities"
        :filteredDistricts="filteredDistricts"
        :filteredVillages="filteredVillages"
        :provinceDropdownOpen="provinceDropdownOpen"
        :cityDropdownOpen="cityDropdownOpen"
        :districtDropdownOpen="districtDropdownOpen"
        :villageDropdownOpen="villageDropdownOpen"
        :error="error"
        @update:selectedProvince="emit('update:selectedProvince', $event)"
        @update:selectedCity="emit('update:selectedCity', $event)"
        @update:selectedDistrict="emit('update:selectedDistrict', $event)"
        @update:selectedVillage="emit('update:selectedVillage', $event)"
        @update:provinceSearch="emit('update:provinceSearch', $event)"
        @update:citySearch="emit('update:citySearch', $event)"
        @update:districtSearch="emit('update:districtSearch', $event)"
        @update:villageSearch="emit('update:villageSearch', $event)"
        @update:provinceDropdownOpen="emit('update:provinceDropdownOpen', $event)"
        @update:cityDropdownOpen="emit('update:cityDropdownOpen', $event)"
        @update:districtDropdownOpen="emit('update:districtDropdownOpen', $event)"
        @update:villageDropdownOpen="emit('update:villageDropdownOpen', $event)"
      />

      <!-- Weather Content -->
      <div v-if="weatherData && selectedLocation && currentWeather" class="max-w-7xl mx-auto text-white">
        
        <!-- A. HEADER SECTION (CONTEXT) -->
        <div class="mb-10 text-center md:text-left animate-fade-in-up">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight font-montserrat mb-2 drop-shadow-lg">
            {{ selectedLocation.location.kecamatan }}
          </h1>
          <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-90 mb-3 sm:mb-4">
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
        <WeatherWarning
          :message="warningMessage"
          :dismissed="warningDismissed"
          @dismiss="dismissWarning"
        />

        <!-- B. MAIN HERO SECTION (CURRENT WEATHER) -->
        <WeatherHero :currentWeather="currentWeather" />

        <!-- C. HOURLY SCROLL -->
        <HourlyForecast :forecast="hourlyForecast" />

        <!-- AI Explanation Section -->
        <AIAnalysis
          :isLoading="isExplaining"
          :rawExplanation="explanation"
          :parsedData="parsedExplanation"
          @analyze="explainForecast"
        />

        <!-- Chart Section -->
        <WeatherChart :weatherData="weatherData" />

      </div>

      <!-- Empty State -->
      <div v-else-if="!selectedVillage && !loading" class="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] text-center text-white p-4 sm:p-6">
        <div class="w-20 h-20 sm:w-32 sm:h-32 bg-white/5 rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-pulse">
          <svg class="w-10 h-10 sm:w-16 sm:h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl sm:text-3xl font-bold mb-3 sm:mb-4 font-montserrat">Mulai Eksplorasi Cuaca</h3>
        <p class="text-sm sm:text-xl opacity-70 max-w-md px-4">Pilih lokasi di atas untuk melihat prakiraan cuaca yang akurat dan mendetail.</p>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] text-white">
        <div class="relative w-16 h-16 sm:w-24 sm:h-24 mb-6 sm:mb-8">
          <div class="absolute inset-0 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div class="absolute inset-3 sm:inset-4 border-4 border-white/10 border-t-white/50 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p class="text-base sm:text-xl font-medium animate-pulse">Memuat Data Satelit...</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed } from "vue";

// Import sub-components
import LocationFilter from "./weather/LocationFilter.vue";
import WeatherWarning from "./weather/WeatherWarning.vue";
import WeatherHero from "./weather/WeatherHero.vue";
import HourlyForecast from "./weather/HourlyForecast.vue";
import AIAnalysis from "./weather/AIAnalysis.vue";
import WeatherChart from "./weather/WeatherChart.vue";

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

// --- Computed Properties ---
const currentWeather = computed(() => {
  if (!props.weatherData?.prakiraan?.[0]?.periode?.[0]) return null;
  return props.weatherData.prakiraan[0].periode[0];
});

const hourlyForecast = computed(() => {
  if (!props.weatherData?.prakiraan) return [];
  return props.weatherData.prakiraan.flatMap(day => day.periode);
});

// --- Warning System ---
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
      break;
    }
  }
}, { immediate: true });

function dismissWarning() {
  warningDismissed.value = true;
}

// --- AI Explanation Logic ---
const explanation = ref(null);
const isExplaining = ref(false);

const parsedExplanation = computed(() => {
  if (!explanation.value) return null;
  
  try {
    let jsonStr = explanation.value.trim();
    jsonStr = jsonStr.replace(/END_JSON\s*$/i, '').trim();
    
    const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    const jsonObjMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonObjMatch) {
      jsonStr = jsonObjMatch[0];
    }
    
    const parsed = JSON.parse(jsonStr);
    if (parsed.morning || parsed.afternoon || parsed.evening || parsed.night) {
      return parsed;
    }
  } catch (e) {
    console.log('Failed to parse AI response as JSON:', e.message);
  }
  
  return null;
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

// --- Formatting Functions ---
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
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>
