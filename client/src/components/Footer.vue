<template>
  <footer
    class="bg-slate-900/40 backdrop-blur-xl border-t border-slate-700/30"
  >
    <div class="container mx-auto px-4 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand and About -->
        <div class="md:col-span-2">
          <h3 class="text-xl font-bold text-white font-montserrat mb-2">
            Cumulus
          </h3>
          <p class="text-slate-400 max-w-sm text-sm">
            Sistem pemantauan cuaca hiperlokal dengan data presisi dari BMKG,
            disajikan dengan antarmuka yang modern dan intuitif.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-slate-200 mb-3">Navigasi</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-slate-400 hover:text-white transition"
                >Beranda</a
              >
            </li>
            <li>
              <a
                href="#weather-section"
                class="text-slate-400 hover:text-white transition"
                >Cek Cuaca</a
              >
            </li>
            <li>
              <a
                href="#about"
                class="text-slate-400 hover:text-white transition"
                >Tentang</a
              >
            </li>
            <li>
              <a
                href="#faq"
                class="text-slate-400 hover:text-white transition"
                >FAQ</a
              >
            </li>
          </ul>
        </div>

        <!-- Data Source -->
        <div>
          <h4 class="font-semibold text-slate-200 mb-3">Sumber Data</h4>
          <p class="text-slate-400 text-sm">
            Seluruh data cuaca pada platform ini disediakan oleh
            <a
              href="https://www.bmkg.go.id"
              target="_blank"
              rel="noopener"
              class="text-blue-400 hover:text-blue-300 transition"
              >BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</a
            >.
          </p>
        </div>
      </div>

      <div
        class="mt-8 pt-8 border-t border-slate-800/60 text-center text-sm text-slate-500"
      >
        <p>
          &copy; {{ new Date().getFullYear() }} Cumulus. Dibuat dengan penuh
          semangat.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script logic needed for this component
</script>
