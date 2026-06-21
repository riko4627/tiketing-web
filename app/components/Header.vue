<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleSidebar'])

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
  // Check local storage or system preference
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
          placeholder="Cari data, laporan, info..."
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

      <!-- Notifications -->
      <div class="relative">
        <button
          class="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80 transition-all relative"
          @click="showNotifications = !showNotifications; showProfileDropdown = false"
        >
          <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900"></span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <!-- Dropdown Notifications Menu -->
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 font-semibold text-sm text-zinc-900 dark:text-white">
            Notifikasi Terbaru
          </div>
          <div class="divide-y divide-zinc-100 dark:divide-zinc-700 max-h-64 overflow-y-auto">
            <a href="#" class="flex px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-zinc-850 dark:text-zinc-250 truncate">Laporan triwulan diupdate</p>
                <p class="text-[10px] text-zinc-400 mt-0.5">2 menit yang lalu</p>
              </div>
            </a>
            <a href="#" class="flex px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-zinc-850 dark:text-zinc-250 truncate">User baru mendaftar</p>
                <p class="text-[10px] text-zinc-400 mt-0.5">1 jam yang lalu</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <span class="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></span>

      <!-- User Menu -->
      <div class="relative">
        <button
          class="flex items-center gap-2.5 focus:outline-none"
          @click="showProfileDropdown = !showProfileDropdown; showNotifications = false"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Avatar"
            class="w-9 h-9 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <span class="hidden md:block text-sm font-semibold text-zinc-750 dark:text-zinc-200">Clara</span>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showProfileDropdown"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
            <p class="text-xs text-zinc-400">Masuk sebagai</p>
            <p class="text-sm font-semibold text-zinc-900 dark:text-white truncate">clara@admin.uwn.id</p>
          </div>
          <div class="py-1">
            <NuxtLink to="/admin/settings" class="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700" @click="showProfileDropdown = false">
              Profil Saya
            </NuxtLink>
            <NuxtLink to="/admin/settings" class="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700" @click="showProfileDropdown = false">
              Pengaturan
            </NuxtLink>
          </div>
          <div class="py-1 border-t border-zinc-200 dark:border-zinc-700">
            <a href="#" class="block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20">
              Keluar
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
