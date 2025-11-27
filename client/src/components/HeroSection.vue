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
  <section class="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-slate-900 pt-24 pb-12 md:py-32">
    <!-- Background Elements -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Right side illustration container -->
      <div class="absolute right-0 top-0 w-full md:w-3/5 h-full flex items-center justify-center opacity-20 z-0">
        <!-- Map Representation -->
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/02/Indonesia_blank_map.svg" 
          alt="Peta Indonesia"
          class="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[140%] h-[140%] object-contain blur-[1px] invert grayscale"
        />
        
        <!-- Abstract Glows -->
        <div class="absolute top-1/4 right-10 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px] animate-drift-slow mix-blend-screen"></div>
        <div class="absolute bottom-1/3 left-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] animate-drift-slower mix-blend-screen"></div>
      </div>

      <!-- Gradient Overlay (Placed AFTER map to overlay it, but adjusted transparency) -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900 z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10"></div>
    </div>

    <div class="container relative mx-auto px-6 md:px-12 z-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
      <!-- Left Column: Content -->
      <div class="text-left space-y-8 md:space-y-10">
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight font-montserrat">
            Cuaca di Sekitarmu, <br />
            <span class="text-blue-400">Tanpa Perlu Mencarinya</span>
          </h1>
          <h2 class="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-lg">
            Prakiraan cuaca resmi dari BMKG yang tersaji untuk setiap sudut Indonesia, dari pusat kota hingga jalan setapak yang jarang disebut peta.
          </h2>
          <p class="text-base text-slate-400 leading-relaxed max-w-xl text-justify">
            Tak semua orang tinggal di kota besar, dan langit setiap tempat punya ceritanya sendiri. Cumulus menghadirkan prakiraan cuaca terkini langsung dari BMKG, untuk lokasi besar maupun titik kecil yang sering terlewatkan. Ketik saja nama desa, kelurahan, atau kecamatan; sisanya biar kami yang menemukan informasinya untukmu.
          </p>
        </div>

        <!-- Search Box -->
        <!-- Search Box (General Style) -->
        <div class="relative max-w-lg z-50">
          <div class="flex rounded-lg border border-slate-600 bg-slate-800/60 backdrop-blur-sm overflow-hidden">
            <!-- Search Icon -->
            <div class="flex items-center pl-4 pr-3 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Input -->
            <input 
              type="text" 
              v-model="searchQuery"
              @input="handleInput"
              @focus="showDropdown = true"
              class="flex-1 bg-transparent py-3.5 px-2 text-slate-200 placeholder-slate-500 outline-none text-base"
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

          <!-- Dropdown Results (Tetap sama, cukup sesuaikan margin jika perlu) -->
          <div v-if="showDropdown && searchResults.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-xl shadow-lg overflow-hidden z-50 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 pt-4">
          <!-- Point 1 -->
          <div class="flex items-start gap-3 group">
            <div class="mt-1 p-2 bg-slate-800/80 rounded-lg text-blue-400 border border-slate-700/50 group-hover:border-blue-500/30 transition-colors">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-200 text-sm group-hover:text-blue-300 transition-colors">Cakupan Menyeluruh</h3>
              <p class="text-xs text-slate-400 mt-0.5">Dari Sabang sampai Merauke.</p>
            </div>
          </div>
          <!-- Point 2 -->
          <div class="flex items-start gap-3 group">
             <div class="mt-1 p-2 bg-slate-800/80 rounded-lg text-blue-400 border border-slate-700/50 group-hover:border-blue-500/30 transition-colors">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-200 text-sm group-hover:text-blue-300 transition-colors">Sumber Resmi BMKG</h3>
              <p class="text-xs text-slate-400 mt-0.5">Data tepercaya dari ahlinya.</p>
            </div>
          </div>
           <!-- Point 3 -->
           <div class="flex items-start gap-3 group">
             <div class="mt-1 p-2 bg-slate-800/80 rounded-lg text-blue-400 border border-slate-700/50 group-hover:border-blue-500/30 transition-colors">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-200 text-sm group-hover:text-blue-300 transition-colors">Pencarian Natural</h3>
              <p class="text-xs text-slate-400 mt-0.5">Ketik seperti yang diucapkan.</p>
            </div>
          </div>
           <!-- Point 4 -->
           <div class="flex items-start gap-3 group">
             <div class="mt-1 p-2 bg-slate-800/80 rounded-lg text-blue-400 border border-slate-700/50 group-hover:border-blue-500/30 transition-colors">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-200 text-sm group-hover:text-blue-300 transition-colors">Akses Seketika</h3>
              <p class="text-xs text-slate-400 mt-0.5">Info hadir dalam hitungan detik.</p>
            </div>
          </div>
        </div>

        <!-- Attribution -->
        <div class="pt-6 border-t border-slate-800/50">
           <p class="text-xs text-slate-500 flex items-center gap-2">
             <span class="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
             Data sumber: <span class="font-medium text-slate-400">Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</span>
           </p>
        </div>
      </div>

      <!-- Right Column: Visuals (Desktop Only) -->
      <div class="hidden md:block relative h-full min-h-[600px] pointer-events-none">
         <!-- Visuals are handled by the background container to ensure correct layering -->
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-20px); }
}

.animate-drift-slow {
  animation: drift 20s ease-in-out infinite;
}

.animate-drift-slower {
  animation: drift 30s ease-in-out infinite reverse;
}
</style>
