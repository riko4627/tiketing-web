<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleSidebar'])

const { user, isStaff, isAdmin } = useAuth()
const route = useRoute()

const menuItems = computed(() => {
  if (isStaff.value) {
    return [
      {
        name: 'Dashboard',
        path: '/admin',
        icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z'
      },
      {
        name: 'Antrean Tiket',
        path: '/admin/tickets',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
      },
      {
        name: 'Dataset AI Feedback',
        path: '/admin/ai-feedback',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z'
      },
      {
        name: 'Master Kategori',
        path: '/admin/categories',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      }
    ]
  }

  // End-User / Pelapor Navigation
  return [
    {
      name: 'Buat Laporan Tiket',
      path: '/tickets/create',
      icon: 'M12 4v16m8-8H4'
    },
    {
      name: 'Tiket Saya',
      path: '/my-tickets',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    }
  ]
})
</script>

<template>
  <div>
    <!-- Mobile Sidebar Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden"
      @click="emit('toggleSidebar')"
    ></div>

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out lg:translate-x-0 overflow-x-hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      ]"
    >
      <!-- Brand Logo Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-zinc-200 dark:border-zinc-800">
        <NuxtLink to="/" class="flex items-center gap-3 font-semibold text-zinc-900 dark:text-white">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span :class="['font-bold tracking-tight text-lg transition-opacity duration-200', !isOpen && 'lg:opacity-0 lg:pointer-events-none']">
            IT Helpdesk
          </span>
        </NuxtLink>
        
        <!-- Toggle button on Mobile -->
        <button
          class="p-1 rounded-lg lg:hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
          @click="emit('toggleSidebar')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="[
            'flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative',
            route.path === item.path
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-100/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white'
          ]"
        >
          <svg
            :class="[
              'w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
              route.path === item.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300'
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>

          <span :class="['transition-opacity duration-200 whitespace-nowrap text-sm', !isOpen && 'lg:opacity-0 lg:pointer-events-none']">
            {{ item.name }}
          </span>

          <!-- Tooltip for collapsed mode on Desktop -->
          <span
            v-if="!isOpen"
            class="absolute left-16 z-50 hidden px-2 py-1.5 ml-2 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-800 rounded-md shadow-md group-hover:lg:block whitespace-nowrap"
          >
            {{ item.name }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Footer Info -->
      <div v-if="user" class="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center uppercase shrink-0">
            {{ user.name?.charAt(0) || 'U' }}
          </div>
          <div :class="['flex-1 overflow-hidden transition-opacity duration-200', !isOpen && 'lg:opacity-0 lg:pointer-events-none']">
            <h4 class="text-xs font-semibold text-zinc-900 dark:text-white truncate">{{ user.name }}</h4>
            <p class="text-[10px] text-zinc-500 dark:text-zinc-400 truncate capitalize">{{ user.role }} • {{ user.department || 'UWN' }}</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
