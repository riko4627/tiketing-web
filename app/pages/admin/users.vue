<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin'
})

const searchQuery = ref('')
const selectedRole = ref('All')
const isModalOpen = ref(false)

const users = ref([
  { id: 1, name: 'Clara Angelica', email: 'clara@admin.uwn.id', role: 'Administrator', status: 'Active', joined: '12 Jan 2025' },
  { id: 2, name: 'Dimas Aditya', email: 'dimas.adit@admin.uwn.id', role: 'Editor', status: 'Active', joined: '03 Feb 2025' },
  { id: 3, name: 'Rian Hidayat', email: 'rian.h@admin.uwn.id', role: 'Staff', status: 'Inactive', joined: '18 Mar 2025' },
  { id: 4, name: 'Siti Rahma', email: 'siti.rahma@admin.uwn.id', role: 'Viewer', status: 'Active', joined: '22 Apr 2025' },
  { id: 5, name: 'Ahmad Yusuf', email: 'yusuf.ahmad@admin.uwn.id', role: 'Staff', status: 'Active', joined: '05 Mei 2025' }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = selectedRole.value === 'All' || user.role === selectedRole.value
    return matchesSearch && matchesRole
  })
})

const addUser = (data) => {
  users.value.push({
    id: users.value.length + 1,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    joined: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  })
  isModalOpen.value = false
}

const deleteUser = (id) => {
  users.value = users.value.filter(user => user.id !== id)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Title -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Manajemen Pengguna</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Kelola hak akses pengguna, peranan, dan status aktifasi dalam sistem portal.</p>
      </div>

      <UiButton variant="primary" @click="isModalOpen = true">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Pengguna
      </UiButton>
    </div>

    <!-- Alert Component -->
    <UiAlert type="info" title="Informasi Penting">
      Perubahan peranan (role) atau penonaktifan akun akan langsung merubah akses portal pengguna secara real-time.
    </UiAlert>

    <!-- Filters and Searches -->
    <div class="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
      <div class="relative flex-1 max-w-md">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau email..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Filter Role:</span>
        <select
          v-model="selectedRole"
          class="px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none dark:text-zinc-300"
        >
          <option value="All">Semua Role</option>
          <option value="Administrator">Administrator</option>
          <option value="Editor">Editor</option>
          <option value="Staff">Staff</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <AdminUserUserTable :users="filteredUsers" @delete="deleteUser" />

    <!-- Create User Modal -->
    <AdminUserUserFormModal :is-open="isModalOpen" @submit="addUser" @close="isModalOpen = false" />
  </div>
</template>
