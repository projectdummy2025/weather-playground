<template>
  <div class="mb-10 sm:mb-16 animate-fade-in-up delay-200">
    <h3 class="text-base sm:text-lg md:text-xl font-bold text-white/90 mb-4 sm:mb-6 flex items-center gap-2">
      <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      Prakiraan 24 Jam
    </h3>
    <div class="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 overflow-hidden shadow-inner">
      <div class="flex overflow-x-auto gap-0 pb-2 sm:pb-4 scrollbar-hide snap-x divide-x divide-white/5">
        <div 
          v-for="(item, index) in forecast" 
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
</template>

<script setup>
defineProps({
  forecast: {
    type: Array,
    required: true
  }
});

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

.delay-200 {
  animation-delay: 0.2s;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
