<template>
  <section id="about" class="py-16 md:py-24">
    <div class="container mx-auto px-6 md:px-12">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white">
          Mengapa Memilih Cumulus?
        </h2>
        <p class="text-slate-400 mt-2 max-w-2xl mx-auto text-center md:text-justify">
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
          class="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50"
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
          class="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50"
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
          class="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50"
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

        <!-- Feature 4: National Coverage -->
        <div
          class="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50"
        >
          <div
            class="w-14 h-14 bg-blue-500/10 text-blue-300 rounded-xl flex items-center justify-center mx-auto mb-5"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0 6l5.447 2.724A1 1 0 0015 20.382V9.618a1 1 0 00-1.447-.894L9 11m0-4v6m0 0l6-3m-6 3V7"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">
            Cakupan Nasional
          </h3>
          <p class="text-slate-400 text-sm text-justify">
            Data cuaca dan pencarian lokasi tersedia untuk seluruh wilayah
            administratif di Indonesia, dari provinsi hingga desa.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// This component has no script logic.
</script>
