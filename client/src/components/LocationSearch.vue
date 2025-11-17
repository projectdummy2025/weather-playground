<template>
  <div class="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-6">
    <h2 class="text-2xl font-bold text-white mb-4 font-montserrat">Cari Lokasi</h2>
    <div class="relative">
      <div class="flex items-center gap-3">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="onSearchInput"
          placeholder="Masukkan nama desa atau kelurahan"
          class="w-full px-4 py-3 bg-slate-800/60 text-white rounded-full border border-slate-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          autocomplete="off"
        />
        <button 
          @click="search"
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg"
        >
          Cari
        </button>
      </div>
      <div v-if="searchResults.length > 0" class="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
        <ul>
          <li 
            v-for="result in searchResults" 
            :key="result.code"
            @click="selectLocation(result)"
            class="px-4 py-2 text-white hover:bg-slate-700 cursor-pointer"
          >
            {{ result.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-6 text-slate-400 text-sm">
      <p v-if="selectedLocation">Lokasi terpilih: <strong>{{ selectedLocation.name }}</strong> (Kode: {{ selectedLocation.code }})</p>
      <p v-else>Masukkan nama lokasi untuk mencari prakiraan cuaca.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      selectedLocation: null,
      debounceTimer: null,
    };
  },
  methods: {
    onSearchInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.search();
      }, 300); // 300ms debounce
    },
    async search() {
      if (this.searchQuery.length < 2) {
        this.searchResults = [];
        return;
      }
      try {
        // Assuming the server is running on localhost:3000
        const response = await fetch(`http://localhost:3000/api/search-location?q=${encodeURIComponent(this.searchQuery)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.searchResults = await response.json();
      } catch (error) {
        console.error('Error fetching locations:', error);
        this.searchResults = [];
      }
    },
    selectLocation(location) {
      this.selectedLocation = location;
      this.searchQuery = location.name;
      this.searchResults = [];
      this.$emit('location-selected', location);
      console.log(`Selected location:`, location);
    },
  },
};
</script>

