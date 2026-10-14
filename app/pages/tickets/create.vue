<script setup>
definePageMeta({
  middleware: 'auth',
})

const { createTicket, getPriorityBadge } = useTickets()

const form = reactive({
  subject: '',
  description: '',
  location: '',
  request_type: 'incident',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const createdTicket = ref(null)
const mlResult = ref(null)

const sampleTemplates = [
  {
    title: 'Proyektor Mati di Ruang Kuliah',
    subject: 'Proyektor Ruang 302 mati total dan lampu indikator merah berkedip',
    description: 'Saat kabel HDMI dicolokkan ke laptop dosen, lampu proyektor tidak memancarkan cahaya sama sekali dan tombol power di remote tidak merespons.',
    location: 'Gedung A Ruang 302',
    request_type: 'incident',
  },
  {
    title: 'Gagal Login SIAKAD Nilai',
    subject: 'Error 500 saat simpan rekap nilai semester di portal dosen',
    description: 'Ketika tombol simpan nilai diklik, muncul alert internal server error 500 dan data nilai mahasiswa tidak tersimpan ke server.',
    location: 'Ruang Dosen Gedung B',
    request_type: 'incident',
  },
  {
    title: 'Wi-Fi Kampus Putus-Nyambung',
    subject: 'Koneksi SSID UWN-Staff sering putus dan latensi sangat tinggi',
    description: 'Koneksi internet nirkabel meminta login ulang setiap 5 menit dan browsing portal akademik sering time out.',
    location: 'Lab Komputer Lt 2',
    request_type: 'incident',
  },
]

const applyTemplate = (tpl) => {
  form.subject = tpl.subject
  form.description = tpl.description
  form.location = tpl.location
  form.request_type = tpl.request_type
}

const handleSubmit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const res = await createTicket(form)
    createdTicket.value = res.data
    mlResult.value = res.ml_prediction
  } catch (err) {
    errorMessage.value = err.message || 'Gagal mengajukan tiket. Pastikan data terisi dengan lengkap.'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.subject = ''
  form.description = ''
  form.location = ''
  form.request_type = 'incident'
  createdTicket.value = null
  mlResult.value = null
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Breadcrumb / Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-zinc-500 mb-1">
          <NuxtLink to="/my-tickets" class="hover:underline">Tiket Saya</NuxtLink>
          <span>/</span>
          <span class="text-zinc-900 dark:text-white font-medium">Buat Laporan Baru</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Ajukan Laporan Kendala IT
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Sistem akan secara otomatis menganalisis laporan Anda untuk menentukan tim teknisi & prioritas penanganan.
        </p>
      </div>

      <NuxtLink
        to="/my-tickets"
        class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Tiket Saya</span>
      </NuxtLink>
    </div>

    <!-- SUCCESS MODAL / CARD (JIKA TIKET SELESAI DIBUAT) -->
    <div
      v-if="createdTicket"
      class="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
    >
      <div class="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="flex-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 mb-2">
            Laporan Berhasil Diajukan
          </div>
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white">
            Tiket {{ createdTicket.ticket_number }}
          </h2>
          <p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Laporan Anda telah berhasil dicatat ke antrean IT Helpdesk. Berikut adalah hasil identifikasi otomatis oleh sistem:
          </p>

          <!-- AI Auto-Routing Result Card -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-xs">
            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Tim Penanganan (Routing)</span>
              <span class="font-bold text-zinc-900 dark:text-white text-sm mt-0.5 block">
                {{ createdTicket.category?.name || 'General Triage' }}
              </span>
              <span v-if="createdTicket.subcategory" class="text-[11px] text-zinc-500">
                Subkategori: {{ createdTicket.subcategory }}
              </span>
            </div>

            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Tingkat Urgensi (Prioritas)</span>
              <div class="mt-1">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs uppercase border',
                    getPriorityBadge(createdTicket.priority).class
                  ]"
                >
                  <span>{{ getPriorityBadge(createdTicket.priority).icon }}</span>
                  <span>{{ getPriorityBadge(createdTicket.priority).label }}</span>
                </span>
              </div>
            </div>

            <div>
              <span class="text-zinc-400 block text-[10px] uppercase font-semibold">Status Prediksi AI</span>
              <div class="mt-1 flex items-center gap-1.5">
                <span
                  v-if="createdTicket.is_ai_predicted"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold text-[11px]"
                >
                  <span>✨ IndoBERT + SVM</span>
                  <span v-if="createdTicket.ai_confidence_score" class="opacity-80">
                    ({{ Math.round(createdTicket.ai_confidence_score * 100) }}%)
                  </span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-[11px]"
                >
                  🛡️ Fallback Triage
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <NuxtLink
              :to="`/tickets/${createdTicket.id}`"
              class="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Lacak Status Tiket Ini</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>

            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Buat Laporan Lain
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FORM INPUT KELUHAN -->
    <div v-else class="space-y-6">
      <!-- Template Cepat (Quick Fill) -->
      <div class="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5">
        <div class="flex items-center gap-2 mb-2 text-indigo-900 dark:text-indigo-300 font-semibold text-xs">
          <span>💡</span>
          <span>Butuh contoh cepat? Klik salah satu template laporan di bawah ini:</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            v-for="(tpl, idx) in sampleTemplates"
            :key="idx"
            type="button"
            @click="applyTemplate(tpl)"
            class="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200/70 dark:border-indigo-800/40 text-left hover:border-indigo-500 hover:shadow-sm transition-all"
          >
            <div class="font-semibold text-xs text-zinc-900 dark:text-white truncate">{{ tpl.title }}</div>
            <div class="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{{ tpl.subject }}</div>
          </button>
        </div>
      </div>

      <!-- Main Form Container -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5"
        >
          <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Subjek Masalah -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Subjek / Ringkasan Kendala <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-zinc-400">Minimal 5 karakter</span>
            </div>
            <input
              v-model="form.subject"
              type="text"
              required
              minlength="5"
              placeholder="Contoh: Proyektor Ruang 301 mati total saat perkuliahan aktif"
              class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>

          <!-- Deskripsi Masalah -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Deskripsi Rinci Masalah <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-zinc-400">Makin detail, makin akurat analisis AI</span>
            </div>
            <textarea
              v-model="form.description"
              required
              minlength="10"
              rows="4"
              placeholder="Jelaskan secara kronologis apa yang terjadi, pesan error yang muncul, atau tindakan yang sudah dicoba..."
              class="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-y"
            ></textarea>
          </div>

          <!-- Ruang & Tipe -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                Lokasi / Gedung & Ruang
              </label>
              <input
                v-model="form.location"
                type="text"
                placeholder="Contoh: Gedung A Lantai 3 Ruang 301"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                Tipe Laporan
              </label>
              <select
                v-model="form.request_type"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              >
                <option value="incident">Gangguan / Kerusakan Fisik / Error (Insiden)</option>
                <option value="service_request">Permintaan Layanan / Setting Baru</option>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-3">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
            >
              <svg
                v-if="isSubmitting"
                class="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ isSubmitting ? 'AI Sedang Menganalisis & Mengirim...' : 'Kirim Laporan Tiket' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
