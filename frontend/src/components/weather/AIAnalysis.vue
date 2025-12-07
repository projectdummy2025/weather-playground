<template>
  <div class="mb-10 sm:mb-16">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
      <h3 class="text-base sm:text-xl md:text-2xl font-bold text-indigo-200 flex items-center gap-2">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        Analisis Cerdas AI
      </h3>
      <button
        @click="emit('analyze')"
        :disabled="isLoading"
        class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm md:text-base font-bold rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
      >
        <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span v-if="isLoading">Menganalisis<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></span>
        <span v-else>Analisis Cuaca</span>
      </button>
    </div>

    <!-- Skeleton Loader during AI analysis - 4 Card Grid -->
    <div v-if="isLoading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
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
    <div v-else-if="parsedData" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
      
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
          <span v-if="parsedData.morning" v-html="getWeatherIcon(parsedData.morning.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
        </div>
        <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedData.morning?.condition || 'Data tidak tersedia' }}</p>
        <div v-if="parsedData.morning?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
          <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedData.morning.action }}</span>
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
          <span v-if="parsedData.afternoon" v-html="getWeatherIcon(parsedData.afternoon.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
        </div>
        <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedData.afternoon?.condition || 'Data tidak tersedia' }}</p>
        <div v-if="parsedData.afternoon?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
          <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedData.afternoon.action }}</span>
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
          <span v-if="parsedData.evening" v-html="getWeatherIcon(parsedData.evening.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
        </div>
        <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedData.evening?.condition || 'Data tidak tersedia' }}</p>
        <div v-if="parsedData.evening?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
          <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedData.evening.action }}</span>
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
          <span v-if="parsedData.night" v-html="getWeatherIcon(parsedData.night.condition)" class="text-2xl sm:text-xl md:text-2xl"></span>
        </div>
        <p class="text-sm sm:text-xs md:text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{{ parsedData.night?.condition || 'Data tidak tersedia' }}</p>
        <div v-if="parsedData.night?.action" class="flex items-start gap-1.5 p-2 sm:p-2 bg-white/10 rounded-lg">
          <svg class="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-xs sm:text-[10px] md:text-xs text-green-200 line-clamp-2">{{ parsedData.night.action }}</span>
        </div>
      </div>
        
    </div>

    <!-- Fallback for non-structured response -->
    <div v-else-if="rawExplanation && !isLoading" class="p-4 sm:p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl">
      <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div class="p-1.5 sm:p-2 bg-indigo-500/20 rounded-lg">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <h4 class="font-bold text-sm sm:text-base md:text-lg text-white">Analisis AI</h4>
      </div>
      <div class="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed space-y-2" v-html="formattedFallback"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isLoading: Boolean,
  rawExplanation: String,
  parsedData: Object,
});

const emit = defineEmits(['analyze']);

// Format fallback explanation as bullet points instead of wall of text
const formattedFallback = computed(() => {
  if (!props.rawExplanation) return '';
  
  const text = props.rawExplanation.trim();
  let points = text.split(/[\n]+/).filter(p => p.trim());
  
  if (points.length <= 1) {
    points = text.split(/(?<=[.!?])\s+/).filter(p => p.trim());
  }
  
  if (points.length <= 1) {
    return `<p class="p-3 bg-white/5 rounded-lg">${text}</p>`;
  }
  
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
    return '🌤️';
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
