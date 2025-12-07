<template>
  <div v-if="message && !dismissed" class="mb-10 animate-bounce-in">
    <div class="relative overflow-hidden bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-2xl shadow-2xl p-1">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
      <div class="relative bg-black/10 backdrop-blur-sm p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="p-3 bg-white/20 rounded-full animate-pulse">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg md:text-xl font-bold text-white mb-1">Peringatan Dini Cuaca</h3>
          <p class="text-white/90 font-medium">{{ message }}</p>
        </div>
        <button @click="emit('dismiss')" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: String,
  dismissed: Boolean,
});

const emit = defineEmits(['dismiss']);
</script>

<style scoped>
@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
