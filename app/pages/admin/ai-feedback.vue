<script setup>
definePageMeta({
  middleware: 'staff',
})

const { getAuditFeedbacks } = useDashboard()
const { formatDateTime, getPriorityBadge } = useTickets()

const feedbacks = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
})
const isLoading = ref(true)

const loadFeedbacks = async (page = 1) => {
  isLoading.value = true
  try {
    const res = await getAuditFeedbacks(page)
    feedbacks.value = res.data
    pagination.value = {
      current_page: res.current_page,
      last_page: res.last_page,
      total: res.total,
    }
  } catch (err) {
    console.error('Gagal mengambil audit feedbacks', err)
  } finally {
    isLoading.value = false
  }
}

const exportDatasetJSON = () => {
  const exportData = feedbacks.value.map((f) => ({
    ticket_number: f.ticket?.ticket_number,
    subject: f.subject_snapshot,
    description: f.description_snapshot,
    old_category: f.old_category?.name,
    ground_truth_category: f.new_category?.name,
    old_priority: f.old_priority,
    ground_truth_priority: f.new_priority,
    reason: f.reason,
    corrected_by: f.user?.name,
    corrected_at: f.created_at,
  }))

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `indobert_svm_retraining_dataset_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadFeedbacks(1)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-zinc-500 mb-1">
          <NuxtLink to="/admin" class="hover:underline">Dashboard</NuxtLink>
          <span>/</span>
          <span class="text-zinc-900 dark:text-white font-medium">Dataset AI Feedback</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>🤖</span>
          <span>Dataset AI Retraining Loop</span>
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Rekaman koreksi manual teknisi sebagai data latih baru (Ground Truth) untuk perbaikan model IndoBERT & SVM.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="exportDatasetJSON"
          :disabled="feedbacks.length === 0"
          class="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Ekspor Dataset JSON</span>
        </button>
      </div>
    </div>

    <!-- Explanatory Banner -->
    <div class="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 text-xs text-indigo-950 dark:text-indigo-200">
      <div class="font-bold flex items-center gap-2 mb-1">
        <span>✨</span>
        <span>Mekanisme Continuous Learning (PRD 3 FR-SVM-05):</span>
      </div>
      <p class="leading-relaxed opacity-90">
        Setiap kali teknisi melakukan <em>Manual Override</em> pada kategori tim atau tingkat urgensi, sistem mencatat teks masalah asli beserta label koreksi manusia (Human-in-the-Loop). Data ini dapat diekspor secara berkala untuk me-retrain model SVM agar akurasi klasifikasi routing dan prioritas terus meningkat seiring bertambahnya variasi laporan di kampus.
      </p>
    </div>

    <!-- Feedbacks Table -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
      <div v-if="isLoading" class="p-8 space-y-4">
        <div v-for="i in 4" :key="i" class="h-12 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl animate-pulse"></div>
      </div>

      <div v-else-if="feedbacks.length === 0" class="p-12 text-center text-zinc-400">
        <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-lg">
          🎯
        </div>
        <h3 class="font-bold text-sm text-zinc-900 dark:text-white">Belum Ada Koreksi Manual</h3>
        <p class="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Prediksi AI pada seluruh tiket saat ini diterima langsung oleh tim tanpa ada override teknisi.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
              <th class="px-5 py-3.5">Nomor & Teks Kendala</th>
              <th class="px-5 py-3.5">Koreksi Kategori</th>
              <th class="px-5 py-3.5">Koreksi Urgensi</th>
              <th class="px-5 py-3.5">Alasan Koreksi</th>
              <th class="px-5 py-3.5">Teknisi Pengoreksi</th>
              <th class="px-5 py-3.5 text-right">Tanggal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
            <tr
              v-for="item in feedbacks"
              :key="item.id"
              class="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <!-- Ticket & Snapshot -->
              <td class="px-5 py-4 max-w-sm">
                <NuxtLink
                  :to="`/admin/tickets/${item.ticket_id}`"
                  class="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline block"
                >
                  {{ item.ticket?.ticket_number || '-' }}
                </NuxtLink>
                <div class="font-semibold text-zinc-900 dark:text-white truncate mt-0.5" :title="item.subject_snapshot">
                  {{ item.subject_snapshot }}
                </div>
                <div class="text-[10px] text-zinc-400 line-clamp-1 mt-0.5" :title="item.description_snapshot">
                  {{ item.description_snapshot }}
                </div>
              </td>

              <!-- Kategori: Old -> New -->
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span class="text-zinc-400 line-through text-[11px]">
                    {{ item.old_category?.name || 'Triage' }}
                  </span>
                  <span class="text-zinc-300">➔</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    {{ item.new_category?.name }}
                  </span>
                </div>
              </td>

              <!-- Prioritas: Old -> New -->
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span class="text-zinc-400 line-through text-[11px] capitalize">
                    {{ item.old_priority }}
                  </span>
                  <span class="text-zinc-300">➔</span>
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] uppercase border',
                      getPriorityBadge(item.new_priority).class
                    ]"
                  >
                    <span>{{ getPriorityBadge(item.new_priority).icon }}</span>
                    <span>{{ getPriorityBadge(item.new_priority).label }}</span>
                  </span>
                </div>
              </td>

              <!-- Reason -->
              <td class="px-5 py-4 max-w-xs">
                <div class="text-zinc-700 dark:text-zinc-300 italic text-[11px]">
                  "{{ item.reason || '-' }}"
                </div>
              </td>

              <!-- Teknisi -->
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="font-semibold text-zinc-800 dark:text-zinc-200">
                  {{ item.user?.name || '-' }}
                </div>
                <div class="text-[10px] text-zinc-400 capitalize">
                  {{ item.user?.role }}
                </div>
              </td>

              <!-- Date -->
              <td class="px-5 py-4 text-right whitespace-nowrap text-zinc-400 text-[11px]">
                {{ formatDateTime(item.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.last_page > 1"
        class="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 text-xs"
      >
        <span class="text-zinc-500">
          Halaman {{ pagination.current_page }} dari {{ pagination.last_page }}
        </span>
        <div class="flex items-center gap-2">
          <button
            :disabled="pagination.current_page <= 1"
            @click="loadFeedbacks(pagination.current_page - 1)"
            class="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Sebelumnya
          </button>
          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="loadFeedbacks(pagination.current_page + 1)"
            class="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
