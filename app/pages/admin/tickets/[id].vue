<script setup>
definePageMeta({
  middleware: 'staff',
})

const route = useRoute()
const ticketId = computed(() => route.params.id)

const { getTicketDetail, updateStatus, overrideTicket, addMessage, getCategories, formatDateTime, getStatusBadge, getPriorityBadge } = useTickets()
const { user } = useAuth()

const ticket = ref(null)
const categories = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

// Message Form State
const newMessage = ref('')
const isInternalNote = ref(false)
const isSendingMessage = ref(false)

// Resolve Modal State
const showResolveModal = ref(false)
const resolutionNotes = ref('')
const isResolving = ref(false)

// Manual Override Modal State (FR-HD-08)
const showOverrideModal = ref(false)
const overrideForm = reactive({
  category_id: '',
  subcategory: '',
  priority: 'sedang',
  reason: '',
})
const isOverriding = ref(false)

const loadTicket = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const [ticketData, catsData] = await Promise.all([
      getTicketDetail(ticketId.value),
      categories.value.length === 0 ? getCategories() : Promise.resolve(categories.value),
    ])
    ticket.value = ticketData
    if (categories.value.length === 0) {
      categories.value = catsData
    }

    // Prefill override form
    overrideForm.category_id = ticketData.category_id
    overrideForm.subcategory = ticketData.subcategory || ''
    overrideForm.priority = ticketData.priority
  } catch (err) {
    errorMessage.value = err.message || 'Gagal memuat detail tiket.'
  } finally {
    isLoading.value = false
  }
}

const handleSetStatus = async (status) => {
  if (status === 'resolved') {
    showResolveModal.value = true
    return
  }

  try {
    const res = await updateStatus(ticketId.value, status)
    ticket.value.status = res.data.status
    ticket.value.assigned_agent = res.data.assigned_agent
    alert(`Status tiket berhasil diubah menjadi: ${status}`)
  } catch (err) {
    alert(err.message || 'Gagal memperbarui status tiket')
  }
}

const submitResolve = async () => {
  if (!resolutionNotes.value.trim()) {
    alert('Harap masukkan catatan solusi perbaikan teknis.')
    return
  }

  isResolving.value = true
  try {
    const res = await updateStatus(ticketId.value, 'resolved', resolutionNotes.value.trim())
    ticket.value = res.data
    showResolveModal.value = false
    resolutionNotes.value = ''
    alert('Tiket berhasil diselesaikan (Resolved)!')
  } catch (err) {
    alert(err.message || 'Gagal menyelesaikan tiket')
  } finally {
    isResolving.value = false
  }
}

const submitOverride = async () => {
  isOverriding.value = true
  try {
    const res = await overrideTicket(ticketId.value, {
      category_id: overrideForm.category_id,
      subcategory: overrideForm.subcategory || undefined,
      priority: overrideForm.priority,
      reason: overrideForm.reason || 'Koreksi manual teknisi IT Helpdesk',
    })

    ticket.value = res.data
    showOverrideModal.value = false
    alert('Override klasifikasi AI berhasil disimpan dan tercatat ke dataset feedback retraining!')
  } catch (err) {
    alert(err.message || 'Gagal melakukan manual override')
  } finally {
    isOverriding.value = false
  }
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim()) return

  isSendingMessage.value = true
  try {
    const res = await addMessage(ticketId.value, newMessage.value.trim(), isInternalNote.value)
    if (!ticket.value.messages) {
      ticket.value.messages = []
    }
    ticket.value.messages.push(res.data)
    newMessage.value = ''
    isInternalNote.value = false
  } catch (err) {
    alert(err.message || 'Gagal mengirim pesan')
  } finally {
    isSendingMessage.value = false
  }
}

onMounted(() => {
  loadTicket()
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header Navigation -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-xs text-zinc-500">
        <NuxtLink to="/admin/tickets" class="hover:underline flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Antrean</span>
        </NuxtLink>
        <span>/</span>
        <span class="font-mono font-bold text-zinc-900 dark:text-white">{{ ticket?.ticket_number || 'Loading...' }}</span>
      </div>

      <div class="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        <!-- Manual Override Button (FR-HD-08) -->
        <button
          type="button"
          @click="showOverrideModal = true"
          class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span>⚖️</span>
          <span>Koreksi AI (Manual Override)</span>
        </button>

        <button
          @click="loadTicket"
          class="p-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
          title="Refresh"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div class="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse"></div>
      <div class="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage || !ticket" class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-8 rounded-2xl text-center">
      <p class="text-sm font-semibold text-rose-700 dark:text-rose-400">{{ errorMessage || 'Tiket tidak ditemukan.' }}</p>
      <NuxtLink to="/admin/tickets" class="mt-4 inline-block text-xs font-semibold text-indigo-600 underline">
        Kembali ke Antrean
      </NuxtLink>
    </div>

    <!-- MAIN TICKET CONTENT -->
    <div v-else class="space-y-6">
      <!-- 1. ACTION STATUS BAR -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
              getStatusBadge(ticket.status).class
            ]"
          >
            <span :class="['w-2 h-2 rounded-full', getStatusBadge(ticket.status).dot]"></span>
            <span>{{ getStatusBadge(ticket.status).label }}</span>
          </span>

          <span class="text-xs text-zinc-400">
            Ditugaskan ke: <strong class="text-zinc-800 dark:text-zinc-200">{{ ticket.assigned_agent?.name || 'Belum ditugaskan (Dalam antrean tim)' }}</strong>
          </span>
        </div>

        <!-- Status Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="ticket.status === 'open'"
            type="button"
            @click="handleSetStatus('in_progress')"
            class="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>🛠️</span>
            <span>Ambil & Mulai Tangani</span>
          </button>

          <button
            v-if="ticket.status === 'in_progress'"
            type="button"
            @click="handleSetStatus('resolved')"
            class="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>✅</span>
            <span>Selesaikan Tiket (Resolved)</span>
          </button>

          <button
            v-if="ticket.status === 'resolved'"
            type="button"
            @click="handleSetStatus('closed')"
            class="px-4 py-2 text-xs font-bold rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>Tutup Tiket (Closed)</span>
          </button>
        </div>
      </div>

      <!-- 2. AUDIT FEEDBACK CALLOUT (JIKA PERNAH DI-OVERRIDE) -->
      <div
        v-if="ticket.audit_feedbacks && ticket.audit_feedbacks.length > 0"
        class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2"
      >
        <div class="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
          <span>⚠️</span>
          <span>Catatan Koreksi AI (Audit Feedback Dataset):</span>
        </div>
        <div v-for="audit in ticket.audit_feedbacks" :key="audit.id" class="pl-5 border-l-2 border-amber-300 dark:border-amber-700 space-y-1">
          <div>
            Kategori diubah dari <strong>{{ audit.old_category?.name || 'Triage' }}</strong> menjadi <strong>{{ audit.new_category?.name }}</strong>
            • Prioritas dari <strong>{{ audit.old_priority }}</strong> menjadi <strong>{{ audit.new_priority }}</strong>
          </div>
          <div class="text-[11px] text-amber-800/80 dark:text-amber-300/80 italic">
            Alasan: "{{ audit.reason }}" — Oleh {{ audit.user?.name }} ({{ formatDateTime(audit.created_at) }})
          </div>
        </div>
      </div>

      <!-- 3. TWO COLUMNS LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Left: Ticket Details & Messages -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Problem Detail Card -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <span class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {{ ticket.ticket_number }}
              </span>
              <h1 class="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                {{ ticket.subject }}
              </h1>
            </div>

            <div>
              <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Rincian Kendala Pelapor
              </h3>
              <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {{ ticket.description }}
              </div>
            </div>

            <!-- Resolution Notes Box (If Resolved) -->
            <div
              v-if="ticket.resolution_notes"
              class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60"
            >
              <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-1.5">
                <span>✅</span>
                <span>Solusi Penanganan Masalah:</span>
              </div>
              <p class="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap">
                {{ ticket.resolution_notes }}
              </p>
              <div v-if="ticket.resolved_at" class="mt-2 text-[10px] text-emerald-700/80 dark:text-emerald-400">
                Terselesaikan pada: {{ formatDateTime(ticket.resolved_at) }}
              </div>
            </div>
          </div>

          <!-- Message Thread & Internal Notes -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 class="text-sm font-bold text-zinc-900 dark:text-white flex items-center justify-between">
              <span>Percakapan & Catatan Internal Teknisi</span>
              <span class="text-xs font-normal text-zinc-400">{{ ticket.messages?.length || 0 }} Komentar</span>
            </h3>

            <!-- Message List -->
            <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
              <div
                v-if="!ticket.messages || ticket.messages.length === 0"
                class="text-center py-8 text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl"
              >
                Belum ada percakapan atau catatan teknis. Tulis pesan di bawah.
              </div>

              <div
                v-for="msg in ticket.messages"
                :key="msg.id"
                :class="[
                  'p-3.5 rounded-2xl text-xs space-y-1',
                  msg.is_internal_note
                    ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60'
                    : msg.user_id === user?.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 ml-6'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 mr-6'
                ]"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{{ msg.user?.name || 'User' }}</span>
                    <span
                      v-if="msg.is_internal_note"
                      class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 uppercase tracking-wider"
                    >
                      🔒 Catatan Internal IT
                    </span>
                    <span
                      v-else-if="msg.user?.role === 'agent' || msg.user?.role === 'admin'"
                      class="px-1.5 py-0.2 rounded text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold"
                    >
                      Teknisi IT
                    </span>
                  </span>
                  <span class="text-[10px] text-zinc-400">{{ formatDateTime(msg.created_at) }}</span>
                </div>
                <p class="text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">{{ msg.message }}</p>
              </div>
            </div>

            <!-- Send Message Input -->
            <form @submit.prevent="handleSendMessage" class="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div class="flex items-center gap-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Ketik balasan untuk pelapor atau catatan internal..."
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
              </div>

              <!-- Internal Note Checkbox -->
              <label class="inline-flex items-center gap-2 cursor-pointer select-none text-[11px] text-zinc-600 dark:text-zinc-400">
                <input
                  v-model="isInternalNote"
                  type="checkbox"
                  class="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Simpan sebagai <strong>Catatan Internal</strong> (hanya teknisi & admin yang bisa melihat, tidak muncul di pelapor)</span>
              </label>
            </form>
          </div>
        </div>

        <!-- Right Column: Meta Info & Reporter Profile -->
        <div class="space-y-5">
          <!-- Reporter Profile Card -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h3 class="font-bold text-zinc-900 dark:text-white text-sm border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Profil Pelapor
            </h3>
            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Nama Pelapor</span>
              <span class="font-bold text-zinc-900 dark:text-white text-sm block">{{ ticket.user?.name }}</span>
            </div>
            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Email</span>
              <a :href="`mailto:${ticket.user?.email}`" class="text-indigo-600 dark:text-indigo-400 hover:underline block truncate">
                {{ ticket.user?.email }}
              </a>
            </div>
            <div v-if="ticket.user?.phone">
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">No. WhatsApp / HP</span>
              <span class="font-medium text-zinc-800 dark:text-zinc-200">{{ ticket.user?.phone }}</span>
            </div>
            <div v-if="ticket.user?.department">
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Unit / Prodi</span>
              <span class="font-medium text-zinc-800 dark:text-zinc-200">{{ ticket.user?.department }}</span>
            </div>
            <div v-if="ticket.location">
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Lokasi Kejadian</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200 block">📍 {{ ticket.location }}</span>
            </div>
          </div>

          <!-- Machine Learning Routing & Urgency Info Card -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3.5 text-xs">
            <h3 class="font-bold text-zinc-900 dark:text-white text-sm border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Hasil Klasifikasi & SLA
            </h3>

            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Kategori Tim (Routing)</span>
              <span class="font-bold text-zinc-900 dark:text-white text-sm block mt-0.5">
                📁 {{ ticket.category?.name || 'General Triage' }}
              </span>
              <span v-if="ticket.subcategory" class="text-zinc-500 text-[11px] block">
                Subkategori: {{ ticket.subcategory }}
              </span>
            </div>

            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Tingkat Urgensi (Prioritas)</span>
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

            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Mesin Klasifikasi</span>
              <div class="mt-1">
                <span
                  v-if="ticket.is_ai_predicted"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                >
                  <span>✨ IndoBERT + Dual SVM</span>
                  <span v-if="ticket.ai_confidence_score">({{ Math.round(ticket.ai_confidence_score * 100) }}%)</span>
                </span>
                <span v-else class="text-zinc-500 font-medium">🛡️ Manual Fallback</span>
              </div>
            </div>

            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Waktu Tiket Masuk</span>
              <span class="text-zinc-700 dark:text-zinc-300 block mt-0.5">
                {{ formatDateTime(ticket.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RESOLVE MODAL -->
    <div
      v-if="showResolveModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
    >
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span>✅</span>
          <span>Selesaikan Tiket Laporan</span>
        </h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Masukkan penjelasan solusi atau perbaikan teknis yang telah diterapkan agar dapat dibaca oleh pelapor.
        </p>

        <div>
          <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
            Catatan Solusi / Resolution Note <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="resolutionNotes"
            rows="4"
            placeholder="Contoh: Unit proyektor telah diganti dengan kabel HDMI baru dan ditest nyala normal."
            class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            @click="showResolveModal = false"
            class="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Batal
          </button>
          <button
            type="button"
            @click="submitResolve"
            :disabled="isResolving || !resolutionNotes.trim()"
            class="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {{ isResolving ? 'Menyimpan...' : 'Simpan & Selesaikan Tiket' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MANUAL OVERRIDE MODAL (FR-HD-08 & PRD 3) -->
    <div
      v-if="showOverrideModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
    >
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span>⚖️</span>
          <span>Koreksi AI (Manual Override)</span>
        </h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Ubah kategori atau tingkat urgensi tiket. Perubahan ini akan otomatis disimpan sebagai dataset <strong>feedback loop</strong> untuk pembelajaran ulang (re-training) AI berikutnya.
        </p>

        <form @submit.prevent="submitOverride" class="space-y-4">
          <!-- Kategori -->
          <div>
            <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Kategori Tim Penanganan Baru
            </label>
            <select
              v-model="overrideForm.category_id"
              required
              class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }} ({{ cat.code }})
              </option>
            </select>
          </div>

          <!-- Subkategori -->
          <div>
            <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Subkategori Teknis
            </label>
            <input
              v-model="overrideForm.subcategory"
              type="text"
              placeholder="Contoh: Peripheral, Access Point, Licensing"
              class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            />
          </div>

          <!-- Prioritas -->
          <div>
            <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Tingkat Urgensi / Prioritas Baru
            </label>
            <select
              v-model="overrideForm.priority"
              required
              class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            >
              <option value="kritis">🔥 Kritis</option>
              <option value="tinggi">⚡ Tinggi</option>
              <option value="sedang">🔹 Sedang</option>
              <option value="rendah">🟢 Rendah</option>
            </select>
          </div>

          <!-- Alasan Koreksi -->
          <div>
            <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Alasan Koreksi AI (Untuk Catatan Dataset)
            </label>
            <input
              v-model="overrideForm.reason"
              type="text"
              placeholder="Misal: Kendala proyektor di ruang ujian aktif memerlukan eskalasi ke prioritas tinggi"
              class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showOverrideModal = false"
              class="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isOverriding"
              class="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {{ isOverriding ? 'Menyimpan Koreksi...' : 'Simpan Koreksi & Catat ke Dataset' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
