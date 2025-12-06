<template>
  <section id="faq" class="py-16 md:py-24">
    <div class="container mx-auto px-6 md:px-12">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white">
          Pertanyaan Umum (FAQ)
        </h2>
        <p class="text-slate-400 mt-2 max-w-2xl mx-auto text-center md:text-justify">
          Jawaban atas beberapa pertanyaan yang mungkin Anda miliki tentang
          Cumulus, dari sumber data hingga cara kerja fitur-fitur utama kami.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <AccordionItem question="Dari mana sumber data cuaca?">
          Data cuaca kami disediakan secara real-time oleh
          <a
            href="https://www.bmkg.go.id"
            target="_blank"
            rel="noopener"
            class="text-blue-400 hover:underline"
            >Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</a
          >, memastikan akurasi dan keandalan informasi.
        </AccordionItem>
        <AccordionItem question="Bagaimana cara kerja pencarian lokasi?">
          Kami menggunakan sistem pencarian hybrid. Saat Anda memilih provinsi,
          data kota/kabupaten akan diambil dari server. Data ini kemudian
          disimpan sementara (cache) di browser Anda untuk mempercepat pencarian
          selanjutnya.
        </AccordionItem>
        <AccordionItem question="Apa itu caching dan apa untungnya?">
          Caching adalah proses penyimpanan data sementara di perangkat Anda.
          Ini membuat aplikasi lebih cepat karena tidak perlu mengunduh data
          yang sama berulang kali. Anda bahkan bisa melihat data cuaca terakhir
          saat offline.
        </AccordionItem>
        <AccordionItem question="Apakah data saya aman?">
          Kami sangat menghargai privasi Anda. Aplikasi ini tidak mengumpulkan
          atau menyimpan data pribadi apa pun dari pengguna. Semua preferensi
          lokasi hanya disimpan di browser Anda.
        </AccordionItem>
        <AccordionItem question="Seberapa sering data cuaca diperbarui?">
          Data cuaca diperbarui sesuai dengan jadwal rilis dari BMKG, yang
          biasanya memberikan prakiraan beberapa kali dalam sehari untuk
          memastikan Anda mendapatkan informasi terbaru.
        </AccordionItem>
      </div>
    </div>
  </section>
</template>

<script setup>
import AccordionItem from "./AccordionItem.vue";
</script>
