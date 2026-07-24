<script setup>
definePageMeta({
  layout: 'admin'
})

// Estimasi waktu selesai maintenance (dapat disesuaikan)
const estimatedCompletion = '21 November 2026 - 15:00 WIB'

// Fungsi sederhana untuk refresh halaman
const refreshPage = () => {
  window.location.reload()
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
    <!-- Card Main Container -->
    <div class="max-w-xl w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 rounded-2xl shadow-sm flex flex-col items-center relative overflow-hidden">
      
      <!-- Top Decorator Glow -->
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Maintenance Animated Icon -->
      <div class="relative w-20 h-20 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-inner">
        <svg class="w-10 h-10 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <!-- Badge Status -->
      <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-full text-xs font-semibold mb-4">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        Sistem Dalam Pemeliharaan
      </span>

      <!-- Title & Description -->
      <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
        Sistem Sedang Diperbarui
      </h1>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
        Kami sedang melakukan pemeliharaan rutin dan peningkatan performa infrastruktur server dashboard untuk pengalaman pengguna yang lebih baik.
      </p>

      <!-- Meta Info Box -->
      <div class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 my-6 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
        <div class="flex justify-between items-center">
          <span class="font-medium text-zinc-500">Estimasi Selesai:</span>
          <span class="font-semibold text-zinc-900 dark:text-zinc-200">{{ estimatedCompletion }}</span>
        </div>
        <div class="border-t border-zinc-200 dark:border-zinc-700/60 pt-2 flex justify-between items-center">
          <span class="font-medium text-zinc-500">Dampak Layanan:</span>
          <span class="font-semibold text-amber-600 dark:text-amber-400">Akses Terbatas</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <button 
          @click="refreshPage"
          class="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Cek Ulang Status
        </button>

        <a 
          href="mailto:support@example.com"
          class="w-full sm:w-auto px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 font-semibold text-xs rounded-xl transition-all border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Hubungi Tim IT
        </a>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 12s linear infinite;
}
</style>