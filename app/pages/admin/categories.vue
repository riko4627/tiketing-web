<script setup>
definePageMeta({
  middleware: 'staff',
})

const { getCategories } = useTickets()
const { apiFetch } = useApi()

const categories = ref([])
const isLoading = ref(true)

const showCreateModal = ref(false)
const isSubmitting = ref(false)
const createForm = reactive({
  code: '',
  name: '',
  description: '',
})

const loadCategories = async () => {
  isLoading.value = true
  try {
    categories.value = await getCategories()
  } catch (err) {
    console.error('Gagal mengambil kategori', err)
  } finally {
    isLoading.value = false
  }
}

const handleCreateCategory = async () => {
  if (!createForm.code || !createForm.name) return

  isSubmitting.value = true
  try {
    await apiFetch('/categories', {
      method: 'POST',
      body: createForm,
    })
    createForm.code = ''
    createForm.name = ''
    createForm.description = ''
    showCreateModal.value = false
    await loadCategories()
    alert('Kategori berhasil ditambahkan!')
  } catch (err) {
    alert(err.message || 'Gagal menambahkan kategori')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadCategories()
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
          <span class="text-zinc-900 dark:text-white font-medium">Master Kategori</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Kelola Kategori Tim IT
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Master data divisi dan kategori penanganan tiket yang ditargetkan oleh model machine learning.
        </p>
      </div>

      <button
        type="button"
        @click="showCreateModal = true"
        class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tambah Kategori Baru</span>
      </button>
    </div>

    <!-- Category Cards / Table -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
              {{ cat.code }}
            </span>
            <span
              :class="[
                'w-2 h-2 rounded-full',
                cat.is_active ? 'bg-emerald-500' : 'bg-zinc-300'
              ]"
              :title="cat.is_active ? 'Aktif' : 'Non-aktif'"
            ></span>
          </div>

          <h3 class="font-bold text-sm text-zinc-900 dark:text-white">
            {{ cat.name }}
          </h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            {{ cat.description || 'Tidak ada deskripsi tambahan.' }}
          </p>
        </div>

        <div class="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Target Auto-Routing</span>
          <span class="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
        </div>
      </div>
    </div>

    <!-- CREATE MODAL -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
    >
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-bold text-zinc-900 dark:text-white">
          Tambah Kategori IT Baru
        </h3>

        <form @submit.prevent="handleCreateCategory" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Kode Unik Kategori (Uppercase)
            </label>
            <input
              v-model="createForm.code"
              type="text"
              required
              placeholder="Contoh: CLOUD_INFRA"
              class="w-full px-3 py-2 text-xs uppercase font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Nama Kategori Tim
            </label>
            <input
              v-model="createForm.name"
              type="text"
              required
              placeholder="Contoh: Infrastruktur Cloud & Server"
              class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Deskripsi Tugas Tim
            </label>
            <textarea
              v-model="createForm.description"
              rows="3"
              placeholder="Penjelasan cakupan masalah yang ditangani tim ini..."
              class="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Kategori' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
