<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['village-selected']);

const searchQuery = ref('');
const searchResults = ref([]);
const showDropdown = ref(false);
const isSearching = ref(false);
const searchTimeout = ref(null);

const searchLocations = async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }

  isSearching.value = true;
  try {
    const response = await fetch(`/api/search-unified?q=${encodeURIComponent(searchQuery.value)}`);
    const data = await response.json();
    searchResults.value = data;
    showDropdown.value = true;
  } catch (error) {
    console.error('Error searching locations:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const handleInput = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(searchLocations, 300);
};

const selectLocation = async (location) => {
  searchQuery.value = location.name;
  showDropdown.value = false;
  isSearching.value = true;

  try {
    let villageData = null;

    if (location.type === 'village') {
      // If it's already a village, use it directly
      // We assume the location object has the necessary data or we fetch it if needed.
      // The search result has id, code, name. Weather API needs adm4 (code).
      villageData = location; 
    } else if (location.type === 'district') {
      // If district, get a random village in it
      const vResponse = await fetch(`/api/villages?district=${location.code}`);
      const villages = await vResponse.json();
      if (villages.length > 0) {
        villageData = villages[Math.floor(Math.random() * villages.length)];
      }
    } else {
      // Regency (existing logic)
      const response = await fetch(`/api/random-village?regencyId=${location.id}`);
      if (!response.ok) throw new Error('Failed to get random village');
      villageData = await response.json();
    }

    if (villageData) {
      emit('village-selected', villageData);
      
      // Scroll to weather section
      const weatherSection = document.getElementById('weather-section');
      if (weatherSection) {
        weatherSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      throw new Error('No village data found');
    }

  } catch (error) {
    console.error('Error selecting location:', error);
    alert('Maaf, gagal memuat data desa untuk wilayah ini.');
  } finally {
    isSearching.value = false;
  }
};

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (!e.target.closest('.search-container')) {
    showDropdown.value = false;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', closeDropdown);
}
</script>

<template>
  <section class="relative w-full min-h-[85vh] flex items-center overflow-hidden pt-24 pb-12 md:py-32">
    <!-- Background Elements -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Right side illustration container -->
      <div class="absolute right-0 top-0 w-full md:w-3/5 h-full flex items-center justify-center opacity-40 z-0">
        <!-- Abstract Glows -->
        <div class="absolute top-1/4 right-10 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px] animate-drift-slow mix-blend-screen"></div>
        <div class="absolute bottom-1/3 left-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] animate-drift-slower mix-blend-screen"></div>
      </div>

      <!-- Gradient Overlay (Placed AFTER map to overlay it, but adjusted transparency) -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10"></div>
    </div>

    <div class="container relative mx-auto px-6 md:px-12 z-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
      <!-- Left Column: Content -->
      <div class="text-left space-y-6 md:space-y-8">
        <div class="space-y-4">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight font-montserrat">
            Cuaca di Sekitarmu, <br />
            <span class="text-blue-400">Tanpa Perlu Mencarinya</span>
          </h1>
          <h2 class="text-base md:text-lg text-slate-300 leading-relaxed max-w-lg">
            Informasi cuaca bersumber langsung dari BMKG, tersedia untuk seluruh penjuru Indonesia. Masukkan nama lokasi Anda untuk mengakses datanya secara cepat.
          </h2>
        </div>

        <!-- Search Box -->
        <div class="relative max-w-lg z-50">
          <div class="flex rounded-lg border border-slate-600 bg-slate-800/60 backdrop-blur-sm overflow-hidden">

            <!-- Input -->
            <input
              type="text"
              v-model="searchQuery"
              @input="handleInput"
              @focus="showDropdown = true"
              class="flex-1 bg-transparent py-3.5 px-4 text-slate-200 placeholder-slate-500 outline-none text-base"
              placeholder="Cari kecamatan, desa, atau kota..."
            />

            <!-- Button -->
            <button
              @click="searchLocations"
              :disabled="isSearching"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span v-if="isSearching" class="flex items-center gap-1">
                <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span>Cari</span>
            </button>
          </div>

          <!-- Dropdown Results -->
          <div v-if="showDropdown && searchResults.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-lg shadow-lg overflow-hidden z-50 max-h-[350px] overflow-y-auto custom-scrollbar">
            <ul>
              <li 
                v-for="result in searchResults" 
                :key="result.id + result.type"
                @click="selectLocation(result)"
                class="px-4 py-3 hover:bg-slate-700/40 cursor-pointer text-slate-200 border-b border-slate-700/30 last:border-0 transition-colors"
              >
                <div class="flex items-center justify-between text-sm">
                  <div>
                    <div class="font-medium">{{ result.name }}</div>
                    <div v-if="result.parent_name" class="text-xs text-slate-400 mt-0.5">
                      {{ result.parent_name }}
                    </div>
                  </div>
                  <span class="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                    {{ result.search_type }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Value Points -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <!-- Point 1 -->
          <div class="flex items-start gap-3 group">
            <div class="mt-1 p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl text-blue-400 border border-slate-700/50 group-hover:border-blue-500/50 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all duration-300">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-100 text-base group-hover:text-blue-300 transition-colors">Jangkauan Hingga Tingkat Desa</h3>
              <p class="text-sm text-slate-400 mt-1 leading-relaxed">Menyajikan informasi cuaca yang relevan bagi seluruh lapisan wilayah, dari keramaian kota hingga desa yang sunyi.</p>
            </div>
          </div>
          <!-- Point 2 -->
          <div class="flex items-start gap-3 group">
             <div class="mt-1 p-2.5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl text-emerald-400 border border-slate-700/50 group-hover:border-emerald-500/50 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.18-4.403A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-100 text-base group-hover:text-emerald-300 transition-colors">Data Otoritatif & Diperbarui Berkala</h3>
              <p class="text-sm text-slate-400 mt-1 leading-relaxed">Prakiraan langsung dari Badan Meteorologi resmi Indonesia, diperbarui setiap 6 jam untuk akurasi maksimal.</p>
            </div>
          </div>
        </div>

        <!-- Attribution -->
        <div class="pt-4 border-t border-slate-800/50">
           <p class="text-xs text-slate-500 flex items-center gap-2">
             <span class="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
             Data sumber: <span class="font-medium text-slate-400">Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</span>
           </p>
        </div>
      </div>

      <!-- Right Column: Visuals (Desktop Only) -->
      <div class="hidden md:flex relative h-full min-h-[500px] items-center justify-center">
         <div class="relative w-full max-w-md lg:max-w-lg">
            <!-- Main Weather Illustration Container -->
            <div class="relative aspect-square">
              <!-- Background Circle -->
              <div class="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 blur-3xl"></div>
              
              <!-- Floating Weather Icons -->
              <div class="absolute inset-0 flex items-center justify-center">
                <!-- Sun Icon -->
                <div class="absolute top-[15%] right-[20%] animate-float-slow">
                  <svg class="w-20 h-20 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v3m0 16v3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M1 12h3m16 0h3M4.22 19.78l2.12-2.12m11.32-11.32l2.12-2.12"/>
                  </svg>
                </div>
                
                <!-- Cloud Icon -->
                <div class="absolute top-[35%] left-[15%] animate-float-medium">
                  <svg class="w-24 h-24 text-slate-300 drop-shadow-xl" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.5 20q-2.28 0-3.89-1.57T1 14.58q0-1.95 1.17-3.48t3.02-1.94q.63-1.95 2.21-3.16T11 4.78q2.52 0 4.27 1.75t1.75 4.27v.5q1.75.13 2.86 1.38T21 15.5q0 1.88-1.31 3.19T16.5 20z"/>
                  </svg>
                </div>
                
                <!-- Rain Drops -->
                <div class="absolute bottom-[30%] right-[25%] animate-float-fast">
                  <svg class="w-16 h-16 text-blue-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </div>
                
                <!-- Lightning Icon -->
                <div class="absolute bottom-[20%] left-[25%] animate-pulse-slow">
                  <svg class="w-14 h-14 text-yellow-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8z"/>
                  </svg>
                </div>
                
                <!-- Small Stars/Sparkles -->
                <div class="absolute top-[25%] left-[35%] animate-twinkle">
                  <svg class="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
                  </svg>
                </div>
                
                <!-- Center Text/Badge -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl px-8 py-6 shadow-2xl">
                    <div class="text-center">
                      <div class="text-4xl font-bold text-white mb-2">Cumulus</div>
                      <div class="text-sm text-slate-400">Weather App</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-20px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-medium {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-15px) translateX(10px); }
}

@keyframes float-fast {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-25px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.animate-drift-slow {
  animation: drift 20s ease-in-out infinite;
}

.animate-drift-slower {
  animation: drift 30s ease-in-out infinite reverse;
}

.animate-float-slow {
  animation: float 6s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 8s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
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
</style>
