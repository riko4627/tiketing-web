<script setup>
definePageMeta({
  middleware: 'auth',
})

const { getTickets, formatDateTime, getStatusBadge, getPriorityBadge } = useTickets()

const tickets = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
})

const isLoading = ref(true)
const selectedStatus = ref('')
const searchQuery = ref('')

const fetchTickets = async (page = 1) => {
  isLoading.value = true
  try {
    const res = await getTickets({
      page,
      status: selectedStatus.value,
      search: searchQuery.value,
    })
    tickets.value = res.data
    pagination.value = {
      current_page: res.current_page,
      last_page: res.last_page,
      total: res.total,
    }
  } catch (err) {
    console.error('Failed to load tickets', err)
  } finally {
    isLoading.value = false
  }
}

watch([selectedStatus], () => {
  fetchTickets(1)
})

let searchTimeout = null
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchTickets(1)
  }, 400)
}

onMounted(() => {
  fetchTickets(1)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Daftar Tiket Kendala Saya
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Pantau status penanganan kendala yang pernah Anda ajukan ke tim IT Helpdesk.
        </p>
      </div>

      <NuxtLink
        to="/tickets/create"
        class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Ajukan Tiket Baru</span>
      </NuxtLink>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
      <!-- Status Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
        <button
          type="button"
          @click="selectedStatus = ''"
          :class="[
            'px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap',
            selectedStatus === ''
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          ]"
        >
          Semua Tiket
        </button>
        <button
          type="button"
          @click="selectedStatus = 'open'"
          :class="[
            'px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap',
            selectedStatus === 'open'
              ? 'bg-amber-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          ]"
        >
          Menunggu (Open)
        </button>
        <button
          type="button"
          @click="selectedStatus = 'in_progress'"
          :class="[
            'px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap',
            selectedStatus === 'in_progress'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          ]"
        >
          Sedang Ditangani
        </button>
        <button
          type="button"
          @click="selectedStatus = 'resolved'"
          :class="[
            'px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap',
            selectedStatus === 'resolved'
              ? 'bg-emerald-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          ]"
        >
          Selesai (Resolved)
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-72">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          @input="onSearchInput"
          type="text"
          placeholder="Cari nomor atau subjek tiket..."
          class="w-full pl-9 pr-3.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900 dark:text-white"
        />
      </div>
    </div>

    <!-- TICKET LIST -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="tickets.length === 0"
      class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center"
    >
      <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-zinc-900 dark:text-white">Tidak ada tiket ditemukan</h3>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
        {{ selectedStatus ? 'Tidak ada tiket dengan status yang Anda pilih.' : 'Anda belum pernah mengajukan tiket laporan kendala IT.' }}
      </p>
      <NuxtLink
        to="/tickets/create"
        class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <span>Ajukan Laporan Sekarang</span>
      </NuxtLink>
    </div>

    <!-- List Items -->
    <div v-else class="space-y-3">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-sm transition-all"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <!-- Meta row -->
            <div class="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {{ ticket.ticket_number }}
              </span>
              <span class="text-zinc-300 dark:text-zinc-700">•</span>
              <span class="text-zinc-500 dark:text-zinc-400">{{ formatDateTime(ticket.created_at) }}</span>
              <span v-if="ticket.location" class="text-zinc-300 dark:text-zinc-700">•</span>
              <span v-if="ticket.location" class="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <span>📍</span>
                <span>{{ ticket.location }}</span>
              </span>
            </div>

            <!-- Subject -->
            <NuxtLink
              :to="`/tickets/${ticket.id}`"
              class="text-base font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block leading-snug"
            >
              {{ ticket.subject }}
            </NuxtLink>

            <!-- Description Excerpt -->
            <p class="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
              {{ ticket.description }}
            </p>

            <!-- Tag Badges -->
            <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <!-- Category Badge -->
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">
                📁 {{ ticket.category?.name || 'General Triage' }}
                <span v-if="ticket.subcategory" class="ml-1 opacity-70">({{ ticket.subcategory }})</span>
              </span>

              <!-- Priority Badge -->
              <span
                :class="[
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] border',
                  getPriorityBadge(ticket.priority).class
                ]"
              >
                <span>{{ getPriorityBadge(ticket.priority).icon }}</span>
                <span>{{ getPriorityBadge(ticket.priority).label }}</span>
              </span>

              <!-- AI Prediction Indicator -->
              <span
                v-if="ticket.is_ai_predicted"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                title="Kategori dan Prioritas dianalisis otomatis oleh Machine Learning"
              >
                ✨ AI Routed
              </span>
            </div>
          </div>

          <!-- Status & Action Button -->
          <div class="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
            <span
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
                getStatusBadge(ticket.status).class
              ]"
            >
              <span :class="['w-2 h-2 rounded-full', getStatusBadge(ticket.status).dot]"></span>
              <span>{{ getStatusBadge(ticket.status).label }}</span>
            </span>

            <NuxtLink
              :to="`/tickets/${ticket.id}`"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Detail & Lacak</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
