<script setup>
definePageMeta({
  middleware: 'staff',
})

const { getTickets, getCategories, formatDateTime, getStatusBadge, getPriorityBadge } = useTickets()

const tickets = ref([])
const categories = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
})

const isLoading = ref(true)

const filters = reactive({
  status: '',
  category_id: '',
  priority: '',
  is_ai_predicted: '',
  search: '',
})

const loadData = async (page = 1) => {
  isLoading.value = true
  try {
    const [ticketsRes, catsRes] = await Promise.all([
      getTickets({
        page,
        status: filters.status,
        category_id: filters.category_id,
        priority: filters.priority,
        is_ai_predicted: filters.is_ai_predicted,
        search: filters.search,
      }),
      categories.value.length === 0 ? getCategories() : Promise.resolve(categories.value),
    ])

    tickets.value = ticketsRes.data
    pagination.value = {
      current_page: ticketsRes.current_page,
      last_page: ticketsRes.last_page,
      total: ticketsRes.total,
    }

    if (categories.value.length === 0) {
      categories.value = catsRes
    }
  } catch (err) {
    console.error('Gagal mengambil daftar antrean tiket', err)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [filters.status, filters.category_id, filters.priority, filters.is_ai_predicted],
  () => {
    loadData(1)
  }
)

let searchTimer = null
const onSearchChange = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    loadData(1)
  }, 400)
}

const resetFilters = () => {
  filters.status = ''
  filters.category_id = ''
  filters.priority = ''
  filters.is_ai_predicted = ''
  filters.search = ''
  loadData(1)
}

onMounted(() => {
  loadData(1)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Antrean Tiket Helpdesk
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Kelola seluruh laporan kendala dari pengguna dengan auto-routing & prioritisasi cerdas.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="loadData(pagination.current_page)"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- FILTER BAR COMPREHENSIVE -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Pencarian
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="filters.search"
              @input="onSearchChange"
              type="text"
              placeholder="Nomor tiket, subjek, pelapor..."
              class="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        <!-- Filter Status -->
        <div>
          <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
          >
            <option value="">Semua Status</option>
            <option value="open">Menunggu (Open)</option>
            <option value="in_progress">Sedang Ditangani</option>
            <option value="resolved">Selesai (Resolved)</option>
            <option value="closed">Ditutup (Closed)</option>
          </select>
        </div>

        <!-- Filter Kategori Tim -->
        <div>
          <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Kategori Tim
          </label>
          <select
            v-model="filters.category_id"
            class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
          >
            <option value="">Semua Kategori</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Filter Prioritas -->
        <div>
          <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Prioritas
          </label>
          <select
            v-model="filters.priority"
            class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
          >
            <option value="">Semua Prioritas</option>
            <option value="kritis">🔥 Kritis</option>
            <option value="tinggi">⚡ Tinggi</option>
            <option value="sedang">🔹 Sedang</option>
            <option value="rendah">🟢 Rendah</option>
          </select>
        </div>
      </div>

      <!-- Quick Reset Button -->
      <div class="flex items-center justify-between text-xs pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
        <div class="text-zinc-500">
          Menampilkan <span class="font-bold text-zinc-900 dark:text-white">{{ pagination.total }}</span> tiket total
        </div>
        <button
          type="button"
          @click="resetFilters"
          class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- TICKET TABLE -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
      <div v-if="isLoading" class="p-8 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl animate-pulse"></div>
      </div>

      <div v-else-if="tickets.length === 0" class="p-12 text-center">
        <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold">
          🔍
        </div>
        <h3 class="font-bold text-sm text-zinc-900 dark:text-white">Tidak ada tiket yang cocok</h3>
        <p class="text-xs text-zinc-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
              <th class="px-5 py-3.5">Nomor Tiket & Subjek</th>
              <th class="px-5 py-3.5">Pelapor</th>
              <th class="px-5 py-3.5">Tim Routing</th>
              <th class="px-5 py-3.5">Urgensi</th>
              <th class="px-5 py-3.5">Status</th>
              <th class="px-5 py-3.5">Klasifikasi</th>
              <th class="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
            <tr
              v-for="ticket in tickets"
              :key="ticket.id"
              class="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
            >
              <!-- Ticket Number & Subject -->
              <td class="px-5 py-4 max-w-xs">
                <NuxtLink
                  :to="`/admin/tickets/${ticket.id}`"
                  class="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline block"
                >
                  {{ ticket.ticket_number }}
                </NuxtLink>
                <div class="font-bold text-zinc-900 dark:text-white truncate mt-0.5" :title="ticket.subject">
                  {{ ticket.subject }}
                </div>
                <div class="text-[10px] text-zinc-400 mt-0.5">
                  {{ formatDateTime(ticket.created_at) }}
                </div>
              </td>

              <!-- Pelapor -->
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="font-semibold text-zinc-900 dark:text-white">
                  {{ ticket.user?.name || '-' }}
                </div>
                <div class="text-[10px] text-zinc-400">
                  {{ ticket.user?.department || 'Civitas UWN' }}
                </div>
              </td>

              <!-- Tim Routing -->
              <td class="px-5 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">
                  📁 {{ ticket.category?.name || 'General Triage' }}
                </span>
                <div v-if="ticket.subcategory" class="text-[10px] text-zinc-400 mt-0.5">
                  Sub: {{ ticket.subcategory }}
                </div>
              </td>

              <!-- Urgensi -->
              <td class="px-5 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-[11px] border uppercase',
                    getPriorityBadge(ticket.priority).class
                  ]"
                >
                  <span>{{ getPriorityBadge(ticket.priority).icon }}</span>
                  <span>{{ getPriorityBadge(ticket.priority).label }}</span>
                </span>
              </td>

              <!-- Status -->
              <td class="px-5 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                    getStatusBadge(ticket.status).class
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', getStatusBadge(ticket.status).dot]"></span>
                  <span>{{ getStatusBadge(ticket.status).label }}</span>
                </span>
              </td>

              <!-- Klasifikasi AI vs Manual -->
              <td class="px-5 py-4 whitespace-nowrap">
                <span
                  v-if="ticket.is_ai_predicted"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                >
                  ✨ AI
                  <span v-if="ticket.ai_confidence_score" class="opacity-70">
                    {{ Math.round(ticket.ai_confidence_score * 100) }}%
                  </span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                >
                  🛡️ Fallback
                </span>
              </td>

              <!-- Action -->
              <td class="px-5 py-4 text-right whitespace-nowrap">
                <NuxtLink
                  :to="`/admin/tickets/${ticket.id}`"
                  class="px-3 py-1.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm inline-flex items-center gap-1"
                >
                  <span>Tangani</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
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
            @click="loadData(pagination.current_page - 1)"
            class="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Sebelumnya
          </button>
          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="loadData(pagination.current_page + 1)"
            class="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
