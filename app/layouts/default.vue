<script setup>
import { ref } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 transition-colors duration-200">
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Main Content wrapper -->
    <div
      :class="[
        'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
      ]"
    >
      <!-- Header -->
      <Header :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />

      <!-- Page Content Slot -->
      <main class="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
