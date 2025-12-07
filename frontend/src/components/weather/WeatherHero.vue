<template>
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
</template>

<script setup>
const props = defineProps({
  currentWeather: {
    type: Object,
    required: true
  }
});

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

.animate-fade-in-left {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>
