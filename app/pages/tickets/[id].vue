<script setup>
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const ticketId = computed(() => route.params.id)

const { getTicketDetail, addMessage, formatDateTime, getStatusBadge, getPriorityBadge } = useTickets()
const { user } = useAuth()

const ticket = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const newMessage = ref('')
const isSendingMessage = ref(false)

const fetchDetail = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    ticket.value = await getTicketDetail(ticketId.value)
  } catch (err) {
    errorMessage.value = err.message || 'Gagal memuat detail tiket.'
  } finally {
    isLoading.value = false
  }
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim()) return

  isSendingMessage.value = true
  try {
    const res = await addMessage(ticketId.value, newMessage.value.trim(), false)
    if (ticket.value) {
      if (!ticket.value.messages) {
        ticket.value.messages = []
      }
      ticket.value.messages.push(res.data)
    }
    newMessage.value = ''
  } catch (err) {
    alert(err.message || 'Gagal mengirim pesan')
  } finally {
    isSendingMessage.value = false
  }
}

const steps = [
  { id: 'open', label: 'Laporan Dibuat', desc: 'Menunggu penugasan teknisi' },
  { id: 'in_progress', label: 'Sedang Ditangani', desc: 'Teknisi melakukan perbaikan' },
  { id: 'resolved', label: 'Terselesaikan', desc: 'Solusi telah diterapkan' },
  { id: 'closed', label: 'Ditutup', desc: 'Kasus selesai sepenuhnya' },
]

const getStepState = (stepId) => {
  const order = ['open', 'in_progress', 'resolved', 'closed']
  const currentIndex = order.indexOf(ticket.value?.status || 'open')
  const stepIndex = order.indexOf(stepId)

  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'current'
  return 'upcoming'
}

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-xs text-zinc-500">
        <NuxtLink to="/my-tickets" class="hover:underline flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Tiket Saya</span>
        </NuxtLink>
        <span>/</span>
        <span class="text-zinc-900 dark:text-white font-mono font-bold">{{ ticket?.ticket_number || 'Loading...' }}</span>
      </div>

      <button
        @click="fetchDetail"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Segarkan Data</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div class="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"></div>
      <div class="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage || !ticket" class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-8 rounded-2xl text-center">
      <p class="text-sm font-semibold text-rose-700 dark:text-rose-400">{{ errorMessage || 'Tiket tidak ditemukan.' }}</p>
      <NuxtLink to="/my-tickets" class="mt-4 inline-block text-xs font-semibold text-indigo-600 underline">
        Kembali ke Daftar Tiket
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- 1. STATUS STEPPER (TIMELINE PROGRESS) -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
          Linimasa Penanganan Tiket
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div
            v-for="(step, idx) in steps"
            :key="step.id"
            class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 relative"
          >
            <!-- Step Indicator Circle -->
            <div
              :class="[
                'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all',
                getStepState(step.id) === 'completed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : getStepState(step.id) === 'current'
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/60 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              ]"
            >
              <svg v-if="getStepState(step.id) === 'completed'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>

            <!-- Step Label & Desc -->
            <div>
              <div
                :class="[
                  'text-xs font-bold leading-tight',
                  getStepState(step.id) === 'current'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : getStepState(step.id) === 'completed'
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-400'
                ]"
              >
                {{ step.label }}
              </div>
              <div class="text-[11px] text-zinc-400 mt-0.5 leading-tight hidden sm:block">
                {{ step.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. DETAIL KENDALA & INFORMASI TEKNIS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Detail & Solusi -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Detail Card -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span class="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {{ ticket.ticket_number }}
                </span>
                <h1 class="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                  {{ ticket.subject }}
                </h1>
              </div>

              <!-- Status Badge -->
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
                  getStatusBadge(ticket.status).class
                ]"
              >
                <span :class="['w-2 h-2 rounded-full', getStatusBadge(ticket.status).dot]"></span>
                <span>{{ getStatusBadge(ticket.status).label }}</span>
              </span>
            </div>

            <!-- Description -->
            <div>
              <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Rincian Kendala yang Dilaporkan
              </h3>
              <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {{ ticket.description }}
              </div>
            </div>

            <!-- Resolution Box (Jika sudah resolved) -->
            <div
              v-if="ticket.resolution_notes"
              class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60"
            >
              <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-1.5">
                <span>✅</span>
                <span>Catatan Penyelesaian dari Teknisi:</span>
              </div>
              <p class="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {{ ticket.resolution_notes }}
              </p>
              <div v-if="ticket.resolved_at" class="mt-2 text-[10px] text-emerald-700/80 dark:text-emerald-400">
                Diselesaikan pada: {{ formatDateTime(ticket.resolved_at) }}
              </div>
            </div>
          </div>

          <!-- Thread Percakapan (Message Thread) -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 class="text-sm font-bold text-zinc-900 dark:text-white flex items-center justify-between">
              <span>Percakapan & Catatan Penanganan</span>
              <span class="text-xs font-normal text-zinc-400">{{ ticket.messages?.length || 0 }} Pesan</span>
            </h3>

            <!-- Messages List -->
            <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
              <div
                v-if="!ticket.messages || ticket.messages.length === 0"
                class="text-center py-8 text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl"
              >
                Belum ada pesan pada tiket ini. Anda bisa menulis pesan tambahan di bawah.
              </div>

              <div
                v-for="msg in ticket.messages"
                :key="msg.id"
                :class="[
                  'p-3.5 rounded-2xl text-xs space-y-1',
                  msg.user_id === user?.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 ml-6'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 mr-6'
                ]"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{{ msg.user?.name || 'User' }}</span>
                    <span
                      v-if="msg.user?.role === 'agent' || msg.user?.role === 'admin'"
                      class="px-1.5 py-0.2 rounded text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold"
                    >
                      Teknisi IT
                    </span>
                  </span>
                  <span class="text-[10px] text-zinc-400">{{ formatDateTime(msg.created_at) }}</span>
                </div>
                <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{{ msg.message }}</p>
              </div>
            </div>

            <!-- Send Message Form -->
            <form @submit.prevent="handleSendMessage" class="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Tulis pesan atau pertanyaan ke teknisi..."
                class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                :disabled="isSendingMessage || !newMessage.trim()"
                class="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <span>Kirim</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- Right: Meta Sidebar Info -->
        <div class="space-y-4">
          <!-- Info Box -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <h3 class="font-bold text-zinc-900 dark:text-white text-sm border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Informasi Penanganan
            </h3>

            <!-- Tim IT (Routing) -->
            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Tim Penanganan (Kategori)</span>
              <span class="font-bold text-zinc-900 dark:text-white text-sm mt-0.5 block">
                📁 {{ ticket.category?.name || 'General Triage' }}
              </span>
              <span v-if="ticket.subcategory" class="text-zinc-500 text-[11px] block mt-0.5">
                Subkategori: {{ ticket.subcategory }}
              </span>
            </div>

            <!-- Prioritas -->
            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Tingkat Urgensi</span>
              <div class="mt-1">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs uppercase border',
                    getPriorityBadge(ticket.priority).class
                  ]"
                >
                  <span>{{ getPriorityBadge(ticket.priority).icon }}</span>
                  <span>{{ getPriorityBadge(ticket.priority).label }}</span>
                </span>
              </div>
            </div>

            <!-- Teknisi yang bertugas -->
            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Teknisi Bertugas</span>
              <div v-if="ticket.assigned_agent" class="mt-1 font-semibold text-zinc-900 dark:text-white">
                👤 {{ ticket.assigned_agent.name }}
                <div class="text-[11px] text-zinc-400 font-normal">{{ ticket.assigned_agent.email }}</div>
              </div>
              <div v-else class="mt-1 text-zinc-400 italic">
                Belum ditugaskan ke teknisi spesifik (dalam antrean tim)
              </div>
            </div>

            <!-- Lokasi Ruang -->
            <div v-if="ticket.location">
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Lokasi Kejadian</span>
              <span class="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                📍 {{ ticket.location }}
              </span>
            </div>

            <!-- Tanggal Dibuat -->
            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Waktu Pengajuan</span>
              <span class="text-zinc-700 dark:text-zinc-300 mt-0.5 block">
                {{ formatDateTime(ticket.created_at) }}
              </span>
            </div>

            <!-- AI Engine Indicator -->
            <div class="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold mb-1">Klasifikasi Otomatis</span>
              <span
                v-if="ticket.is_ai_predicted"
                class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-semibold text-[11px]"
              >
                <span>✨ IndoBERT + Dual SVM</span>
                <span v-if="ticket.ai_confidence_score" class="opacity-80">
                  ({{ Math.round(ticket.ai_confidence_score * 100) }}% confidence)
                </span>
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px]"
              >
                🛡️ Sistem Fallback Triage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
