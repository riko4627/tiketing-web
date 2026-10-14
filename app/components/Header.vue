<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleSidebar'])

const { user, isAuthenticated, logout } = useAuth()

const isDark = ref(false)
const showProfileDropdown = ref(false)
const showNotifications = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <header class="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
    <div class="flex items-center gap-4">
      <!-- Toggle Sidebar Button -->
      <button
        class="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80 transition-colors"
        @click="emit('toggleSidebar')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Global Search -->
      <div class="relative hidden sm:block w-64 md:w-80">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Cari nomor tiket, subjek, lokasi..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <!-- Dark Mode Toggle -->
      <button
        class="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80 transition-all duration-200"
        @click="toggleDarkMode"
        title="Toggle Theme"
      >
        <svg v-if="isDark" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <!-- Divider -->
      <span class="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></span>

      <!-- User Menu -->
      <div v-if="isAuthenticated && user" class="relative">
        <button
          class="flex items-center gap-2.5 focus:outline-none p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          @click="showProfileDropdown = !showProfileDropdown; showNotifications = false"
        >
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
            {{ user.name?.charAt(0) || 'U' }}
          </div>
          <div class="hidden md:flex flex-col text-left">
            <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
              {{ user.name }}
            </span>
            <span class="text-[10px] text-zinc-400 font-medium capitalize">
              {{ user.role === 'admin' ? 'Supervisor IT' : user.role === 'agent' ? 'Teknisi IT' : 'Pelapor' }}
            </span>
          </div>
          <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showProfileDropdown"
          class="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <p class="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Login Sebagai</p>
            <p class="text-xs font-semibold text-zinc-900 dark:text-white truncate mt-0.5">{{ user.email }}</p>
            <div class="mt-1.5">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                {{ user.role }}
              </span>
            </div>
          </div>
          <div class="p-1.5 border-t border-zinc-100 dark:border-zinc-800">
            <button
              @click="logout(); showProfileDropdown = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      </div>

      <!-- If not logged in -->
      <div v-else>
        <NuxtLink
          to="/login"
          class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
        >
          Masuk
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
