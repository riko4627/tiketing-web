<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'admin'
})

const activeTab = ref('profile') // profile, system, security

const profile = ref({
  name: 'Clara Angelica',
  email: 'clara@admin.uwn.id',
  role: 'Administrator',
  phone: '+62 812-3456-7890',
  bio: 'Administrator Portal & IT Support Officer.'
})

const system = ref({
  siteName: 'Admin Portal System',
  timezone: 'WIB (GMT+7)',
  autoSave: true,
  refreshInterval: '5 Menit'
})

const security = ref({
  apiKey: 'uwn_live_728a192bf83cde094',
  ipWhitelist: '127.0.0.1',
  enableMfa: true
})

const handleSave = () => {
  alert('Pengaturan berhasil disimpan!')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Title -->
    <div>
      <h1 class="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Pengaturan Sistem</h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Ubah konfigurasi profil, sistem portal, dan parameter keamanan API Anda.</p>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
      <!-- Tabs Navigation Left (Vertical Sidebar layout) -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-2xl shadow-sm flex flex-row md:flex-col gap-1 overflow-x-auto whitespace-nowrap">
        <button
          :class="[
            'px-4 py-2.5 text-left text-xs font-semibold rounded-xl transition-all w-full flex items-center gap-3',
            activeTab === 'profile'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-600 dark:text-zinc-455 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          ]"
          @click="activeTab = 'profile'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profil Pengguna</span>
        </button>

        <button
          :class="[
            'px-4 py-2.5 text-left text-xs font-semibold rounded-xl transition-all w-full flex items-center gap-3',
            activeTab === 'system'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-600 dark:text-zinc-455 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          ]"
          @click="activeTab = 'system'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span>Konfigurasi Portal</span>
        </button>

        <button
          :class="[
            'px-4 py-2.5 text-left text-xs font-semibold rounded-xl transition-all w-full flex items-center gap-3',
            activeTab === 'security'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-600 dark:text-zinc-455 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          ]"
          @click="activeTab = 'security'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Keamanan & API Key</span>
        </button>
      </div>

      <!-- Settings Forms Content (Right Panel, 3/4 width) -->
      <div class="md:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <!-- Form profile -->
        <form v-if="activeTab === 'profile'" @submit.prevent="handleSave" class="p-6 space-y-6">
          <div class="border-b border-zinc-150 dark:border-zinc-800 pb-4">
            <h3 class="font-bold text-zinc-900 dark:text-white">Profil Saya</h3>
            <p class="text-xs text-zinc-400 mt-0.5">Informasi akun personal dan lisensi Anda.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Nama Pengguna</label>
              <input
                v-model="profile.name"
                type="text"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Alamat Email</label>
              <input
                v-model="profile.email"
                type="email"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Nomor Telepon</label>
              <input
                v-model="profile.phone"
                type="text"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Level Akun / Hak Akses</label>
              <input
                v-model="profile.role"
                type="text"
                disabled
                class="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none text-zinc-500 cursor-not-allowed"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Deskripsi Bio Singkat</label>
              <textarea
                v-model="profile.bio"
                rows="3"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-white"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-zinc-150 dark:border-zinc-800">
            <button
              type="submit"
              class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>

        <!-- Form system -->
        <form v-if="activeTab === 'system'" @submit.prevent="handleSave" class="p-6 space-y-6">
          <div class="border-b border-zinc-150 dark:border-zinc-800 pb-4">
            <h3 class="font-bold text-zinc-900 dark:text-white">Konfigurasi Portal</h3>
            <p class="text-xs text-zinc-400 mt-0.5">Atur opsi penamaan situs dan interval sinkronisasi backend.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Nama Portal Admin</label>
              <input
                v-model="system.siteName"
                type="text"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Zona Waktu Sistem</label>
              <select
                v-model="system.timezone"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none dark:text-white"
              >
                <option>WIB (GMT+7)</option>
                <option>WITA (GMT+8)</option>
                <option>WIT (GMT+9)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Interval Refresh Live Data</label>
              <select
                v-model="system.refreshInterval"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none dark:text-white"
              >
                <option>1 Menit</option>
                <option>5 Menit</option>
                <option>10 Menit</option>
              </select>
            </div>
            <div class="flex items-center gap-3 pt-6">
              <input
                v-model="system.autoSave"
                type="checkbox"
                class="w-4 h-4 rounded text-indigo-650 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:ring-indigo-500"
              />
              <span class="text-xs font-semibold text-zinc-750 dark:text-zinc-300">Aktifkan Auto-Save Konfigurasi</span>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-zinc-150 dark:border-zinc-800">
            <button
              type="submit"
              class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>

        <!-- Form security -->
        <form v-if="activeTab === 'security'" @submit.prevent="handleSave" class="p-6 space-y-6">
          <div class="border-b border-zinc-150 dark:border-zinc-800 pb-4">
            <h3 class="font-bold text-zinc-900 dark:text-white">Keamanan & Kunci API</h3>
            <p class="text-xs text-zinc-400 mt-0.5">Konfigurasi kunci akses API dan pengaturan Whitelist IP address.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">API Key Aktif (Live)</label>
              <input
                v-model="security.apiKey"
                type="text"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-white font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">IP Address Whitelist</label>
              <input
                v-model="security.ipWhitelist"
                type="text"
                class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-white font-mono"
              />
            </div>
            <div class="flex items-center gap-3 pt-6">
              <input
                v-model="security.enableMfa"
                type="checkbox"
                class="w-4 h-4 rounded text-indigo-650 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:ring-indigo-500"
              />
              <span class="text-xs font-semibold text-zinc-750 dark:text-zinc-300">Wajibkan MFA (Multi-Factor Auth)</span>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-zinc-150 dark:border-zinc-800">
            <button
              type="submit"
              class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

