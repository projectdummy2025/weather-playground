<template>
  <div class="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-6">
    <h2 class="text-2xl font-bold text-white mb-4 font-montserrat">Cari Lokasi</h2>
    <div class="flex items-center gap-3">
      <input 
        type="text" 
        v-model="location" 
        placeholder="Masukkan nama kota atau daerah"
        class="w-full px-4 py-3 bg-slate-800/60 text-white rounded-full border border-slate-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button 
        @click="search"
        class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg"
      >
        Cari
      </button>
    </div>
    <div class="mt-6 text-slate-400 text-sm">
      <p>Hasil pencarian akan ditampilkan di sini.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      location: '',
    };
  },
  methods: {
    search() {
      //  search logic will go here
      console.log(`Searching for location: ${this.location}`);
    },
  },
};
</script>
