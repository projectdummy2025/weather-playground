<template>
  <div class="relative z-40 mb-8 sm:mb-12">
    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white font-montserrat mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      Pilih Lokasi
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <!-- Province Filter -->
        <div class="relative" data-province-dropdown>
          <div class="relative group">
            <input
              type="text"
              :value="selectedProvince ? provinces.find((p) => p.code === selectedProvince)?.name : provinceSearch"
              @input="emit('update:provinceSearch', $event.target.value); emit('update:provinceDropdownOpen', true)"
              @click="emit('update:provinceDropdownOpen', !provinceDropdownOpen)"
              placeholder="Provinsi..."
              class="w-full px-4 py-3 bg-white/5 backdrop-blur-md text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 placeholder-white/40 transition-all hover:bg-white/10"
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
              class="w-full px-4 py-3 bg-white/5 backdrop-blur-md text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 placeholder-white/40 transition-all hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
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
              class="w-full px-4 py-3 bg-white/5 backdrop-blur-md text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 placeholder-white/40 transition-all hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
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
              class="w-full px-4 py-3 bg-white/5 backdrop-blur-md text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 placeholder-white/40 transition-all hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
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
    
    <div v-if="error" class="mt-4 p-3 sm:p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm sm:text-base flex items-center gap-2 sm:gap-3 backdrop-blur-sm">
      <svg class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {{ error }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  provinces: Array,
  cities: Array,
  districts: Array,
  villages: Array,
  selectedProvince: String,
  selectedCity: String,
  selectedDistrict: String,
  selectedVillage: String,
  provinceSearch: String,
  citySearch: String,
  districtSearch: String,
  villageSearch: String,
  filteredProvinces: Array,
  filteredCities: Array,
  filteredDistricts: Array,
  filteredVillages: Array,
  provinceDropdownOpen: Boolean,
  cityDropdownOpen: Boolean,
  districtDropdownOpen: Boolean,
  villageDropdownOpen: Boolean,
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
</style>
