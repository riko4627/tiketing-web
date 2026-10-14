<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { login, isLoading } = useAuth()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  try {
    const result = await login({
      email: form.email,
      password: form.password,
    })

    const redirectPath = route.query.redirect
    if (redirectPath && typeof redirectPath === 'string') {
      return navigateTo(redirectPath)
    }

    if (result.user.role === 'admin' || result.user.role === 'agent') {
      return navigateTo('/admin')
    } else {
      return navigateTo('/my-tickets')
    }
  } catch (err) {
    errorMessage.value = err.message || 'Login gagal. Periksa kembali email dan password Anda.'
  }
}

const fillDemo = (email, password = 'password') => {
  form.email = email
  form.password = password
  handleLogin()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 font-sans">
    <div class="w-full max-w-md">
      <!-- Brand Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          IT Helpdesk UWN
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Sistem Tiketing Cerdas Berbasis Auto-Routing AI
        </p>
      </div>

      <!-- Main Login Card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
          Masuk ke Akun
        </h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          Gunakan email institusi dan password Anda untuk masuk.
        </p>

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

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="nama@ithelpdesk.ac.id"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow pr-10"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-2 py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center gap-2"
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
            <span>{{ isLoading ? 'Sedang Masuk...' : 'Masuk Sekarang' }}</span>
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Belum punya akun pelapor?
          <NuxtLink to="/register" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Daftar di sini
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Demo Switcher -->
      <div class="mt-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
        <div class="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 mb-3 text-center">
          ⚡ Quick Demo Login (Sekali Klik)
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            @click="fillDemo('admin@ithelpdesk.ac.id')"
            class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-left transition-colors flex items-center gap-2"
          >
            <span class="text-base">👑</span>
            <div>
              <div class="font-semibold text-zinc-800 dark:text-zinc-200">Admin IT</div>
              <div class="text-[10px] text-zinc-400">Supervisor</div>
            </div>
          </button>

          <button
            type="button"
            @click="fillDemo('agent.hw@ithelpdesk.ac.id')"
            class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-left transition-colors flex items-center gap-2"
          >
            <span class="text-base">🛠️</span>
            <div>
              <div class="font-semibold text-zinc-800 dark:text-zinc-200">Teknisi HW</div>
              <div class="text-[10px] text-zinc-400">Hardware & Lab</div>
            </div>
          </button>

          <button
            type="button"
            @click="fillDemo('dosen@ithelpdesk.ac.id')"
            class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-left transition-colors flex items-center gap-2"
          >
            <span class="text-base">👨‍🏫</span>
            <div>
              <div class="font-semibold text-zinc-800 dark:text-zinc-200">Dosen</div>
              <div class="text-[10px] text-zinc-400">Pelapor Kendala</div>
            </div>
          </button>

          <button
            type="button"
            @click="fillDemo('karyawan@ithelpdesk.ac.id')"
            class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-left transition-colors flex items-center gap-2"
          >
            <span class="text-base">👩‍💼</span>
            <div>
              <div class="font-semibold text-zinc-800 dark:text-zinc-200">Staff BAAK</div>
              <div class="text-[10px] text-zinc-400">Pelapor Kendala</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
