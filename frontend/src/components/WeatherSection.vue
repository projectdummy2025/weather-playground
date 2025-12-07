<template>
  <section
    id="weather-section"
    class="min-h-screen w-full py-4 sm:py-8"
  >
    <div class="container mx-auto px-4 sm:px-6 md:px-12">
    <!-- Location Filter Section -->
    <div class="relative z-40 mb-12">
      <div class="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl">
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-white font-montserrat mb-4 sm:mb-6 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Pilih Lokasi
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Province Filter -->
          <div class="relative" data-province-dropdown>
            <div class="relative group">
              <input
                type="text"
                :value="selectedProvince ? provinces.find((p) => p.code === selectedProvince)?.name : provinceSearch"
                @input="emit('update:provinceSearch', $event.target.value); emit('update:provinceDropdownOpen', true)"
                @click="emit('update:provinceDropdownOpen', !provinceDropdownOpen)"
                placeholder="Provinsi..."
                class="w-full px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all"
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
                class="w-full px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all disabled:opacity-40"
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
                class="w-full px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all disabled:opacity-40"
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
                class="w-full px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 transition-all disabled:opacity-40"
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
      <div v-if="warningMessage && !warningDismissed" class="mb-10 animate-bounce-in">
        <div class="relative overflow-hidden bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-2xl shadow-2xl p-1">
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
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 mb-16 animate-fade-in-left">
        <!-- Primary Element -->
        <div class="flex flex-col items-center lg:items-start">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <img 
                :src="currentWeather.url_ikon || currentWeather.image" 
                :alt="currentWeather.weather_desc" 
                class="relative w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl floating-animation" 
              />
            </div>
            <div class="flex flex-col">
              <div class="flex items-start">
                <span class="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-thin tracking-tighter text-white leading-none">
                  {{ currentWeather.t }}°
                </span>
              </div>
              <div class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-indigo-100 capitalize mt-2 ml-2">
                {{ currentWeather.weather_desc }}
              </div>
            </div>
          </div>
          <div class="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-white/60 ml-0 sm:ml-4 text-sm sm:text-base font-medium tracking-wide uppercase">
             <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {{ formatDay(currentWeather.local_datetime) }}
             </span>
             <span class="hidden sm:block w-1.5 h-1.5 bg-white/40 rounded-full"></span>
             <span class="text-xs sm:text-sm">Terakhir update: {{ formatTime(currentWeather.local_datetime) }}</span>
          </div>
        </div>

        <!-- Secondary Grid - Enhanced Weather Stats -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto">
          
          <!-- Humidity Card with Circular Progress -->
          <div class="relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-cyan-500/20 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center hover:border-blue-400/40 transition-all duration-500 group min-w-[110px] md:min-w-[140px]">
            <!-- Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Circular Progress Ring -->
            <div class="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <!-- Background circle -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
                <!-- Progress circle -->
                <circle 
                  cx="18" cy="18" r="14" 
                  fill="none" 
                  stroke="url(#humidity-gradient)" 
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="`${(currentWeather.hu / 100) * 88} 88`"
                  class="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="humidity-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#60a5fa"/>
                    <stop offset="100%" stop-color="#22d3ee"/>
                  </linearGradient>
                </defs>
              </svg>
              <!-- Center Icon -->
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-6 h-6 md:w-8 md:h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
            </div>
            
            <!-- Value -->
            <div class="relative z-10 text-2xl md:text-3xl font-bold text-white mb-1">
              {{ currentWeather.hu }}<span class="text-sm md:text-lg font-normal text-blue-200">%</span>
            </div>
            
            <!-- Label & Status -->
            <div class="text-[10px] md:text-xs uppercase tracking-widest text-blue-200/80 font-medium mb-1">Kelembaban</div>
            <div class="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full" :class="getHumidityStatus(currentWeather.hu).class">
              {{ getHumidityStatus(currentWeather.hu).text }}
            </div>
          </div>

          <!-- Wind Card with Compass -->
          <div class="relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-teal-600/10 to-emerald-500/20 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center hover:border-cyan-400/40 transition-all duration-500 group min-w-[110px] md:min-w-[140px]">
            <!-- Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Compass with Direction Arrow -->
            <div class="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4">
              <!-- Compass Ring -->
              <div class="absolute inset-0 rounded-full border-2 border-white/10">
                <!-- Cardinal Points -->
                <span class="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] font-bold text-cyan-300">N</span>
                <span class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] text-white/40">S</span>
                <span class="absolute top-1/2 -left-1 -translate-y-1/2 text-[8px] md:text-[10px] text-white/40">W</span>
                <span class="absolute top-1/2 -right-1 -translate-y-1/2 text-[8px] md:text-[10px] text-white/40">E</span>
              </div>
              <!-- Direction Arrow -->
              <div class="absolute inset-0 flex items-center justify-center transition-transform duration-700" :style="{ transform: `rotate(${currentWeather.wind_dir || 0}deg)` }">
                <svg class="w-8 h-8 md:w-10 md:h-10 text-cyan-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 20l8-6 8 6z"/>
                </svg>
              </div>
            </div>
            
            <!-- Value -->
            <div class="relative z-10 flex items-baseline gap-0.5 text-2xl md:text-3xl font-bold text-white mb-1">
              {{ currentWeather.wind_speed }}<span class="text-[10px] md:text-sm font-normal text-cyan-200">km/h</span>
            </div>
            
            <!-- Label & Status -->
            <div class="text-[10px] md:text-xs uppercase tracking-widest text-cyan-200/80 font-medium mb-1">Angin</div>
            <div class="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full" :class="getWindStatus(currentWeather.wind_speed).class">
              {{ getWindStatus(currentWeather.wind_speed).text }}
            </div>
          </div>

          <!-- Visibility Card with Eye Animation -->
          <div class="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-green-600/10 to-teal-500/20 backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center hover:border-emerald-400/40 transition-all duration-500 group min-w-[110px] md:min-w-[140px] col-span-2 md:col-span-1">
            <!-- Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Eye Icon with Pulse -->
            <div class="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4 flex items-center justify-center">
              <!-- Outer Glow Ring -->
              <div class="absolute inset-0 rounded-full border border-emerald-400/30 group-hover:border-emerald-400/50 transition-colors"></div>
              <div class="absolute inset-2 rounded-full border border-emerald-400/20"></div>
              <!-- Eye Icon -->
              <svg class="w-8 h-8 md:w-10 md:h-10 text-emerald-300 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            
            <!-- Value -->
            <div class="relative z-10 text-2xl md:text-3xl font-bold text-white mb-1">
              {{ currentWeather.vs_text || '10km+' }}
            </div>
            
            <!-- Label & Status -->
            <div class="text-[10px] md:text-xs uppercase tracking-widest text-emerald-200/80 font-medium mb-1">Visibilitas</div>
            <div class="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200">
              {{ getVisibilityStatus(currentWeather.vs_text) }}
            </div>
          </div>
          
        </div>
      </div>

      <!-- C. HOURLY SCROLL -->
      <div class="mb-10 sm:mb-16 animate-fade-in-up delay-200">
        <h3 class="text-base sm:text-lg md:text-xl font-bold text-white/90 mb-4 sm:mb-6 flex items-center gap-2">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Prakiraan 24 Jam
        </h3>
        <div class="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 overflow-hidden shadow-inner">
          <div class="flex overflow-x-auto gap-0 pb-2 sm:pb-4 scrollbar-hide snap-x divide-x divide-white/5">
            <div 
              v-for="(item, index) in hourlyForecast" 
              :key="index" 
              class="flex-shrink-0 w-20 sm:w-24 md:w-28 px-1 sm:px-2 flex flex-col items-center justify-between snap-start group cursor-default hover:bg-white/5 transition-colors rounded-lg py-2"
            >
              <span class="text-xs sm:text-sm md:text-base font-medium text-white/50 mb-2 sm:mb-4 group-hover:text-white/80 transition-colors">{{ formatTime(item.local_datetime) }}</span>
              <img :src="item.url_ikon || item.image" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4 object-contain group-hover:scale-110 transition-transform drop-shadow-md" />
              <span class="text-base sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">{{ item.t }}°</span>
              
              <!-- Humidity Indicator -->
               <div class="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm font-medium text-blue-300/70 bg-blue-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  {{ item.hu }}%
               </div>
            </div>
          </div>
          
          <!-- Fade effect on sides -->
          <div class="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-slate-900/50 to-transparent pointer-events-none rounded-l-2xl sm:rounded-l-3xl"></div>
          <div class="absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-slate-900/50 to-transparent pointer-events-none rounded-r-2xl sm:rounded-r-3xl"></div>
        </div>
      </div>

      <!-- AI Explanation Section (Restyled) -->
      <div class="mb-10 sm:mb-16">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 class="text-base sm:text-xl md:text-2xl font-bold text-indigo-200 flex items-center gap-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            Analisis Cerdas AI
          </h3>
          <button
            @click="explainForecast"
            :disabled="isExplaining"
            class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm md:text-base font-bold rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <svg v-if="isExplaining" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span v-if="isExplaining">Menganalisis<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></span>
            <span v-else>Analisis Cuaca</span>
          </button>
        </div>

        <!-- Skeleton Loader during AI analysis - 4 Card Grid -->
        <div v-if="isExplaining" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
          <div v-for="i in 4" :key="i" class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-7 h-7 sm:w-9 sm:h-9 bg-white/10 rounded-lg"></div>
              <div class="flex-1 space-y-1.5">
                <div class="h-3 sm:h-4 w-12 sm:w-14 bg-white/10 rounded"></div>
                <div class="h-2 sm:h-2.5 w-16 sm:w-20 bg-white/10 rounded"></div>
              </div>
              <div class="w-5 h-5 sm:w-6 sm:h-6 bg-white/10 rounded"></div>
            </div>
            <div class="space-y-1.5 sm:space-y-2 mb-2">
              <div class="h-2 sm:h-2.5 w-full bg-white/10 rounded"></div>
              <div class="h-2 sm:h-2.5 w-4/5 bg-white/10 rounded"></div>
            </div>
            <div class="h-6 sm:h-8 w-full bg-white/10 rounded-lg"></div>
          </div>
        </div>

        <!-- Timeline-Based Layout - 4 Card Grid -->
        <div v-else-if="explanation && parsedExplanation" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
          
          <!-- Morning Card -->
          <div class="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-3 sm:gap-3 mb-3 sm:mb-3">
              <div class="p-2 sm:p-2 bg-amber-400/20 rounded-lg">
                <svg class="w-5 h-5 sm:w-5 sm:h-5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-lg sm:text-base md:text-lg text-white">Pagi</h4>
                <p class="text-xs sm:text-[10px] md:text-xs text-amber-200/70">06:00 - 11:00</p>
              </div>
              <span v-if="parsedExplanation.morning" v-html="getWeatherIcon(parsedExplanation.morning.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
            </div>
            <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedExplanation.morning?.condition || 'Data tidak tersedia' }}</p>
            <div v-if="parsedExplanation.morning?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
              <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedExplanation.morning.action }}</span>
            </div>
          </div>

          <!-- Afternoon Card -->
          <div class="bg-gradient-to-br from-sky-500/20 to-blue-500/20 backdrop-blur-xl border border-sky-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-3 sm:gap-3 mb-3 sm:mb-3">
              <div class="p-2 sm:p-2 bg-sky-400/20 rounded-lg">
                <svg class="w-5 h-5 sm:w-5 sm:h-5 text-sky-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-lg sm:text-base md:text-lg text-white">Siang</h4>
                <p class="text-xs sm:text-[10px] md:text-xs text-sky-200/70">12:00 - 15:00</p>
              </div>
              <span v-if="parsedExplanation.afternoon" v-html="getWeatherIcon(parsedExplanation.afternoon.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
            </div>
            <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedExplanation.afternoon?.condition || 'Data tidak tersedia' }}</p>
            <div v-if="parsedExplanation.afternoon?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
              <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedExplanation.afternoon.action }}</span>
            </div>
          </div>

          <!-- Evening Card -->
          <div class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-3 sm:gap-3 mb-3 sm:mb-3">
              <div class="p-2 sm:p-2 bg-purple-400/20 rounded-lg">
                <svg class="w-5 h-5 sm:w-5 sm:h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-lg sm:text-base md:text-lg text-white">Sore</h4>
                <p class="text-xs sm:text-[10px] md:text-xs text-purple-200/70">16:00 - 18:00</p>
              </div>
              <span v-if="parsedExplanation.evening" v-html="getWeatherIcon(parsedExplanation.evening.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
            </div>
            <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedExplanation.evening?.condition || 'Data tidak tersedia' }}</p>
            <div v-if="parsedExplanation.evening?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
              <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedExplanation.evening.action }}</span>
            </div>
          </div>

          <!-- Night Card -->
          <div class="bg-gradient-to-br from-indigo-500/20 to-slate-700/20 backdrop-blur-xl border border-indigo-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-3 sm:gap-3 mb-3 sm:mb-3">
              <div class="p-2 sm:p-2 bg-indigo-400/20 rounded-lg">
                <svg class="w-5 h-5 sm:w-5 sm:h-5 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-lg sm:text-base md:text-lg text-white">Malam</h4>
                <p class="text-xs sm:text-[10px] md:text-xs text-indigo-200/70">19:00 - 05:00</p>
              </div>
              <span v-if="parsedExplanation.night" v-html="getWeatherIcon(parsedExplanation.night.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
            </div>
            <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedExplanation.night?.condition || 'Data tidak tersedia' }}</p>
            <div v-if="parsedExplanation.night?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
              <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedExplanation.night.action }}</span>
            </div>
          </div>
            
        </div>

        <!-- Fallback for non-structured response -->
        <div v-else-if="explanation && !isExplaining" class="p-4 sm:p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl">
          <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div class="p-1.5 sm:p-2 bg-indigo-500/20 rounded-lg">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h4 class="font-bold text-sm sm:text-base md:text-lg text-white">Analisis AI</h4>
          </div>
          <div class="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed space-y-2" v-html="formattedFallbackExplanation"></div>
        </div>
      </div>

      <!-- Chart Section (Restyled) -->
      <div class="mb-8 sm:mb-12 p-4 sm:p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl">
        <h3 class="text-base sm:text-xl font-bold mb-4 sm:mb-6 opacity-90">Grafik Tren</h3>
        <div class="h-48 sm:h-64 md:h-80 w-full">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>

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

const parsedExplanation = computed(() => {
  if (!explanation.value) return null;
  
  // Attempt to parse structured JSON response from backend
  try {
    let jsonStr = explanation.value.trim();
    
    // Remove END_JSON suffix if present (from AI service stop sequence)
    jsonStr = jsonStr.replace(/END_JSON\s*$/i, '').trim();
    
    // Try to extract JSON from response (handle markdown code blocks)
    const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    // Also try to find JSON object in the response
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
    // Not JSON, return null to use fallback render
  }
  
  return null;
});

const renderedExplanation = computed(() => {
  if (!explanation.value) return '';
  return marked.parse(explanation.value);
});

// Format fallback explanation as bullet points instead of wall of text
const formattedFallbackExplanation = computed(() => {
  if (!explanation.value) return '';
  
  // Split by sentences or line breaks
  const text = explanation.value.trim();
  
  // If it contains line breaks, split by them
  let points = text.split(/[\n]+/).filter(p => p.trim());
  
  // If no line breaks, try to split by sentences
  if (points.length <= 1) {
    points = text.split(/(?<=[.!?])\s+/).filter(p => p.trim());
  }
  
  // If still just one point, wrap it
  if (points.length <= 1) {
    return `<p class="p-3 bg-white/5 rounded-lg">${text}</p>`;
  }
  
  // Format as bullet points
  return `<ul class="space-y-2">${points.map(p => 
    `<li class="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
      <span class="text-indigo-400 mt-0.5">•</span>
      <span>${p.trim()}</span>
    </li>`
  ).join('')}</ul>`;
});

// Get weather emoji icon based on condition text
function getWeatherIcon(condition) {
  if (!condition) return '';
  const text = condition.toLowerCase();
  
  if (text.includes('petir') || text.includes('thunderstorm')) {
    return '⛈️';
  } else if (text.includes('hujan lebat') || text.includes('heavy rain')) {
    return '🌧️';
  } else if (text.includes('hujan') || text.includes('rain') || text.includes('gerimis') || text.includes('drizzle')) {
    return '🌦️';
  } else if (text.includes('berawan') || text.includes('cloud') || text.includes('mendung')) {
    return '☁️';
  } else if (text.includes('cerah') || text.includes('sunny') || text.includes('clear')) {
    return '☀️';
  } else if (text.includes('kabut') || text.includes('fog') || text.includes('asap')) {
    return '🌫️';
  } else if (text.includes('panas') || text.includes('hot')) {
    return '🔥';
  } else if (text.includes('dingin') || text.includes('cold') || text.includes('sejuk')) {
    return '❄️';
  } else {
    return '🌤️'; // Default: partly cloudy
  }
}

// Helper function to get humidity status with styling
function getHumidityStatus(hu) {
  const humidity = parseInt(hu) || 0;
  if (humidity < 30) {
    return { text: 'Kering', class: 'bg-amber-500/20 text-amber-200' };
  } else if (humidity < 60) {
    return { text: 'Normal', class: 'bg-blue-500/20 text-blue-200' };
  } else if (humidity < 80) {
    return { text: 'Lembab', class: 'bg-cyan-500/20 text-cyan-200' };
  } else {
    return { text: 'Sangat Lembab', class: 'bg-indigo-500/20 text-indigo-200' };
  }
}

// Helper function to get wind status with styling
function getWindStatus(speed) {
  const windSpeed = parseFloat(speed) || 0;
  if (windSpeed < 5) {
    return { text: 'Tenang', class: 'bg-emerald-500/20 text-emerald-200' };
  } else if (windSpeed < 15) {
    return { text: 'Sepoi', class: 'bg-cyan-500/20 text-cyan-200' };
  } else if (windSpeed < 30) {
    return { text: 'Sedang', class: 'bg-amber-500/20 text-amber-200' };
  } else {
    return { text: 'Kencang', class: 'bg-red-500/20 text-red-200' };
  }
}

// Helper function to get visibility status
function getVisibilityStatus(vsText) {
  if (!vsText) return 'Sangat Baik';
  const text = vsText.toLowerCase();
  if (text.includes('10') || text.includes('+')) {
    return 'Sangat Baik';
  } else if (text.includes('5') || text.includes('6') || text.includes('7') || text.includes('8') || text.includes('9')) {
    return 'Baik';
  } else if (text.includes('3') || text.includes('4')) {
    return 'Sedang';
  } else {
    return 'Buruk';
  }
}

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

/* Typing dots animation */
.typing-dots span {
  animation: typing-dot 1.4s infinite;
  opacity: 0;
}
.typing-dots span:nth-child(1) {
  animation-delay: 0s;
}
.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-dot {
  0%, 20% { opacity: 0; }
  40% { opacity: 1; }
  60%, 100% { opacity: 0; }
}
</style>
