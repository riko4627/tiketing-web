<script setup>
definePageMeta({
  middleware: 'staff',
})

const { getStats } = useDashboard()
const { user } = useAuth()

const stats = ref(null)
const isLoading = ref(true)

const loadDashboard = async () => {
  isLoading.value = true
  try {
    stats.value = await getStats()
  } catch (err) {
    console.error('Gagal memuat statistik dashboard', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Greeting -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Dashboard IT Helpdesk
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Selamat datang kembali, <span class="font-semibold text-zinc-800 dark:text-zinc-200">{{ user?.name }}</span>! Pantau distribusi antrean dan performa model AI di sini.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="loadDashboard"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Segarkan Data</span>
        </button>

        <NuxtLink
          to="/admin/tickets"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <span>Buka Antrean Tiket</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800"></div>
    </div>

    <!-- STATS CONTENT -->
    <div v-else-if="stats" class="space-y-6">
      <!-- 1. SUMMARY STAT CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Tiket -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-zinc-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Total Tiket Masuk</span>
            <div class="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold">
              📑
            </div>
          </div>
          <div class="text-2xl font-black text-zinc-900 dark:text-white">
            {{ stats.summary.total_tickets }}
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Keseluruhan laporan terdata</p>
        </div>

        <!-- Open Tiket -->
        <div class="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Menunggu (Open)</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              ⏳
            </div>
          </div>
          <div class="text-2xl font-black text-amber-600 dark:text-amber-400">
            {{ stats.summary.open_tickets }}
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Belum ditangani atau ditugaskan</p>
        </div>

        <!-- In Progress -->
        <div class="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Sedang Ditangani</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              🛠️
            </div>
          </div>
          <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {{ stats.summary.in_progress_tickets }}
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Dalam proses perbaikan teknisi</p>
        </div>

        <!-- Resolved -->
        <div class="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Terselesaikan</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              ✅
            </div>
          </div>
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {{ stats.summary.resolved_tickets }}
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Solusi berhasil diterapkan</p>
        </div>
      </div>

      <!-- 2. AI MACHINE LEARNING PERFORMANCE CARD (PRD 2 & 3 METRICS) -->
      <div class="bg-gradient-to-br from-indigo-900 via-indigo-950 to-zinc-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h2 class="text-lg font-bold text-white">
                  Performa Model AI (IndoBERT + Dual-Task SVM)
                </h2>
                <p class="text-xs text-indigo-200">
                  Metrik real-time efektivitas auto-routing dan kalibrasi prioritas otomatis
                </p>
              </div>
            </div>

            <NuxtLink
              to="/admin/ai-feedback"
              class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-md transition-colors inline-flex items-center gap-1.5"
            >
              <span>Lihat Dataset Feedback Retraining</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>

          <!-- AI Metric Indicators -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <span class="text-[10px] uppercase font-bold text-indigo-300 block">Total Tiket via AI</span>
              <span class="text-2xl font-black text-white mt-1 block">
                {{ stats.ai_metrics.total_ai_predicted }}
              </span>
              <span class="text-[10px] text-indigo-200">dari {{ stats.summary.total_tickets }} total tiket</span>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <span class="text-[10px] uppercase font-bold text-indigo-300 block">Tingkat Penerimaan AI</span>
              <span class="text-2xl font-black text-emerald-400 mt-1 block">
                {{ stats.ai_metrics.ai_acceptance_rate_percentage }}%
              </span>
              <span class="text-[10px] text-indigo-200">Akurasi diterima staf tanpa override</span>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <span class="text-[10px] uppercase font-bold text-indigo-300 block">Rata-rata Skor Keyakinan</span>
              <span class="text-2xl font-black text-amber-300 mt-1 block">
                {{ Math.round(stats.ai_metrics.average_confidence_score * 100) }}%
              </span>
              <span class="text-[10px] text-indigo-200">Skor probabilitas model</span>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <span class="text-[10px] uppercase font-bold text-indigo-300 block">Manual Override Staf</span>
              <span class="text-2xl font-black text-rose-300 mt-1 block">
                {{ stats.ai_metrics.total_overridden_by_agents }}
              </span>
              <span class="text-[10px] text-indigo-200">Tercatat untuk dataset retraining</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. DISTRIBUSI KATEGORI & PRIORITAS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Distribusi Kategori -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-zinc-900 dark:text-white text-sm mb-4 flex items-center justify-between">
            <span>Distribusi Beban Kerja per Kategori</span>
            <span class="text-xs font-normal text-zinc-400">Tim IT</span>
          </h3>

          <div class="space-y-3">
            <div
              v-for="cat in stats.by_category"
              :key="cat.id"
              class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  📁
                </div>
                <div>
                  <div class="font-semibold text-xs text-zinc-900 dark:text-white">{{ cat.name }}</div>
                  <div class="text-[10px] text-zinc-400 font-mono">{{ cat.code }}</div>
                </div>
              </div>
              <div class="text-right">
                <span class="font-black text-sm text-zinc-900 dark:text-white">{{ cat.tickets_count }}</span>
                <span class="text-[10px] text-zinc-400 block">Tiket</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Distribusi Prioritas -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-zinc-900 dark:text-white text-sm mb-4 flex items-center justify-between">
            <span>Distribusi Tingkat Urgensi (SLA)</span>
            <span class="text-xs font-normal text-zinc-400">Prioritas</span>
          </h3>

          <div class="space-y-3">
            <!-- Kritis -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <div class="flex items-center gap-2">
                <span class="text-base">🔥</span>
                <span class="font-bold text-xs text-rose-700 dark:text-rose-400 uppercase">Kritis</span>
              </div>
              <span class="font-black text-sm text-rose-700 dark:text-rose-400">
                {{ stats.by_priority.kritis || 0 }} Tiket
              </span>
            </div>

            <!-- Tinggi -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <div class="flex items-center gap-2">
                <span class="text-base">⚡</span>
                <span class="font-bold text-xs text-orange-700 dark:text-orange-400 uppercase">Tinggi</span>
              </div>
              <span class="font-black text-sm text-orange-700 dark:text-orange-400">
                {{ stats.by_priority.tinggi || 0 }} Tiket
              </span>
            </div>

            <!-- Sedang -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <div class="flex items-center gap-2">
                <span class="text-base">🔹</span>
                <span class="font-bold text-xs text-blue-700 dark:text-blue-400 uppercase">Sedang</span>
              </div>
              <span class="font-black text-sm text-blue-700 dark:text-blue-400">
                {{ stats.by_priority.sedang || 0 }} Tiket
              </span>
            </div>

            <!-- Rendah -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <div class="flex items-center gap-2">
                <span class="text-base">🟢</span>
                <span class="font-bold text-xs text-emerald-700 dark:text-emerald-400 uppercase">Rendah</span>
              </div>
              <span class="font-black text-sm text-emerald-700 dark:text-emerald-400">
                {{ stats.by_priority.rendah || 0 }} Tiket
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
