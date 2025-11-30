<template>
  <section id="about" class="py-16 md:py-24 bg-slate-800/20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white">
          Mengapa Memilih Cumulus?
        </h2>
        <p class="text-slate-400 mt-2 max-w-2xl mx-auto text-justify">
          Fitur-fitur unggulan yang dirancang untuk memberikan pengalaman
          terbaik dalam memantau cuaca, dengan antarmuka yang bersih, cepat,
          dan intuitif.
        </p>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
      >
        <!-- Feature 1: Fast Access -->
        <div
          class="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50"
        >
          <div
            class="w-14 h-14 bg-blue-500/10 text-blue-300 rounded-xl flex items-center justify-center mx-auto mb-5"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Akses Cepat</h3>
          <p class="text-slate-400 text-sm text-justify">
            Data cuaca real-time dari BMKG untuk seluruh wilayah Indonesia,
            disajikan dengan cepat dan responsif.
          </p>
        </div>

        <!-- Feature 2: Smart Caching -->
        <div
          class="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50"
        >
          <div
            class="w-14 h-14 bg-blue-500/10 text-blue-300 rounded-xl flex items-center justify-center mx-auto mb-5"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 7v10m16-10v10M8 7l4 10 4-10"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">
            Pencarian Cerdas
          </h3>
          <p class="text-slate-400 text-sm text-justify">
            Sistem pencarian lokasi yang efisien dengan cache untuk akses data
            yang lebih cepat pada kunjungan berikutnya.
          </p>
        </div>

        <!-- Feature 3: Responsive SPA -->
        <div
          class="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50"
        >
          <div
            class="w-14 h-14 bg-blue-500/10 text-blue-300 rounded-xl flex items-center justify-center mx-auto mb-5"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Desain Modern</h3>
          <p class="text-slate-400 text-sm text-justify">
            Antarmuka yang bersih dan responsif, dapat diakses dengan nyaman di
            berbagai perangkat.
          </p>
        </div>

        <!-- Feature 4: Offline Mode -->
        <div
          class="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50"
        >
          <div
            class="w-14 h-14 bg-blue-500/10 text-blue-300 rounded-xl flex items-center justify-center mx-auto mb-5"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Mode Offline</h3>
          <p class="text-slate-400 text-sm text-justify">
            Akses data cuaca terakhir yang Anda lihat bahkan saat tidak
            terhubung ke internet berkat sistem cache.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// This component has no script logic.
</script>
