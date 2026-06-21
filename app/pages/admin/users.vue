<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin'
})

const searchQuery = ref('')
const selectedRole = ref('All')
const isModalOpen = ref(false)

const newUser = ref({
  name: '',
  email: '',
  role: 'Staff',
  status: 'Active'
})

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

const addUser = () => {
  if (newUser.value.name && newUser.value.email) {
    users.value.push({
      id: users.value.length + 1,
      name: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
      status: newUser.value.status,
      joined: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    })
    newUser.value = { name: '', email: '', role: 'Staff', status: 'Active' }
    isModalOpen.value = false
  }
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

    <!-- Users Table using custom UiCard and UiTable -->
    <UiCard no-padding>
      <UiTable
        :headers="['Nama Lengkap', 'Email', 'Peranan', 'Status', 'Bergabung Pada', 'Aksi']"
        :items="filteredUsers"
      >
        <template #default="{ item }">
          <td class="px-6 py-4 font-semibold text-zinc-900 dark:text-white">{{ item.name }}</td>
          <td class="px-6 py-4 font-mono text-xs text-zinc-650 dark:text-zinc-400">{{ item.email }}</td>
          <td class="px-6 py-4">
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                item.role === 'Administrator' && 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
                item.role === 'Editor' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
                item.role === 'Staff' && 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
                item.role === 'Viewer' && 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              ]"
            >
              {{ item.role }}
            </span>
          </td>
          <td class="px-6 py-4">
            <span
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              ]"
            >
              <span :class="['w-1.5 h-1.5 rounded-full', item.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-400']"></span>
              {{ item.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-xs text-zinc-500">{{ item.joined }}</td>
          <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
            <button class="text-xs font-semibold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 hover:underline">
              Edit
            </button>
            <button
              class="text-xs font-semibold text-rose-650 hover:text-rose-700 dark:text-rose-450 hover:underline"
              @click="deleteUser(item.id)"
            >
              Hapus
            </button>
          </td>
        </template>
      </UiTable>
    </UiCard>

    <!-- Create User Modal Dialog using custom UiModal -->
    <UiModal :is-open="isModalOpen" title="Tambah Pengguna Baru" @close="isModalOpen = false">
      <form @submit.prevent="addUser" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Nama Lengkap</label>
          <input
            v-model="newUser.name"
            type="text"
            required
            placeholder="Masukkan nama..."
            class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Alamat Email</label>
          <input
            v-model="newUser.email"
            type="email"
            required
            placeholder="contoh@admin.uwn.id"
            class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Peranan (Role)</label>
          <select
            v-model="newUser.role"
            class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none dark:text-white"
          >
            <option>Staff</option>
            <option>Editor</option>
            <option>Viewer</option>
            <option>Administrator</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Status Keaktifan</label>
          <select
            v-model="newUser.status"
            class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none dark:text-white"
          >
            <option value="Active">Aktif</option>
            <option value="Inactive">Nonaktif</option>
          </select>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <UiButton variant="outline" @click="isModalOpen = false">
            Batal
          </UiButton>
          <UiButton type="submit" variant="primary">
            Simpan Pengguna
          </UiButton>
        </div>
      </form>
    </UiModal>
  </div>
</template>
