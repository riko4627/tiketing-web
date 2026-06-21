<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleSidebar'])

const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
  { name: 'User Management', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
]

const route = useRoute()
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <span :class="['font-bold tracking-tight text-lg transition-opacity duration-200', !isOpen && 'lg:opacity-0 lg:pointer-events-none']">
            AdminPortal
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
          <!-- SVG Icon -->
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

          <!-- Label text -->
          <span :class="['transition-opacity duration-200 whitespace-nowrap', !isOpen && 'lg:opacity-0 lg:pointer-events-none']">
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
      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Avatar"
            class="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <div :class="['flex-1 overflow-hidden transition-opacity duration-200', !isOpen && 'lg:opacity-0 lg:pointer-events-none']">
            <h4 class="text-sm font-semibold text-zinc-900 dark:text-white truncate">Clara Angelica</h4>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
