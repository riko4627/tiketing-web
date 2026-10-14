<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { register, isLoading } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  department: '',
})

const errorMessage = ref('')
const errors = ref({})

const handleRegister = async () => {
  errorMessage.value = ''
  errors.value = {}

  try {
    await register(form)
    return navigateTo('/my-tickets')
  } catch (err) {
    errorMessage.value = err.message || 'Registrasi gagal. Silakan periksa formulir Anda.'
    if (err.errors) {
      errors.value = err.errors
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 font-sans">
    <div class="w-full max-w-md">
      <!-- Brand Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Daftar Akun Pelapor
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Buat akun untuk mengajukan dan memantau tiket keluhan IT
        </p>
      </div>

      <!-- Main Card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
        >
          <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nama Lengkap
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Nama lengkap Anda"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name[0] }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email Institusi
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="nama@uwn.ac.id"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email[0] }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password (Minimal 6 karakter)
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password[0] }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Nomor WhatsApp
              </label>
              <input
                v-model="form.phone"
                type="text"
                placeholder="0812xxxx"
                class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Unit / Prodi
              </label>
              <input
                v-model="form.department"
                type="text"
                placeholder="Misal: FST / BAAK"
                class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-3 py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <svg
              v-if="isLoading"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang' }}</span>
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Sudah memiliki akun?
          <NuxtLink to="/login" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Masuk di sini
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
