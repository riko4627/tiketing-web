<script setup>
const { isAuthenticated, isStaff } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    if (isStaff.value) {
      navigateTo('/admin')
    } else {
      navigateTo('/my-tickets')
    }
  }
})
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 sm:py-16 space-y-12">
    <!-- Hero Section -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span>Sistem IT Helpdesk Berbasis NLP IndoBERT & SVM</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-2xl mx-auto leading-tight">
        Layanan Cepat Tanggap Kendala Teknologi Kampus
      </h1>

      <p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
        Laporkan kendala perangkat keras, jaringan internet, atau sistem informasi akademik. AI kami secara otomatis mengarahkan tiket Anda ke teknisi yang tepat.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
        <NuxtLink
          to="/tickets/create"
          class="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
        >
          <span>Ajukan Laporan Tiket</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </NuxtLink>

        <NuxtLink
          to="/login"
          class="px-6 py-3 rounded-xl font-semibold text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all"
        >
          Masuk ke Akun
        </NuxtLink>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3">
        <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-lg">
          🤖
        </div>
        <h3 class="font-bold text-base text-zinc-900 dark:text-white">Auto-Routing Cerdas</h3>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Teks keluhan Anda dianalisis menggunakan IndoBERT untuk langsung diarahkan ke antrean tim pakar terkait (Hardware, Software, Jaringan).
        </p>
      </div>

      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
          ⚡
        </div>
        <h3 class="font-bold text-base text-zinc-900 dark:text-white">Auto-Prioritization SLA</h3>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Menilai tingkat urgensi masalah secara otomatis (Rendah hingga Kritis) guna memastikan gangguan ruang kuliah dan ujian segera tertangani.
        </p>
      </div>

      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
          📱
        </div>
        <h3 class="font-bold text-base text-zinc-900 dark:text-white">Transparan & Realtime</h3>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Lacak status penyelesaian, berkomunikasi langsung dengan teknisi yang ditugaskan, dan ketahui solusi penanganan secara lengkap.
        </p>
      </div>
    </div>
  </div>
</template>
