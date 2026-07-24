<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  name: '',
  email: '',
  role: 'Staff',
  status: 'Active'
})

watch(() => props.isOpen, (val) => {
  if (val) {
    form.value = { name: '', email: '', role: 'Staff', status: 'Active' }
  }
})

const handleSubmit = () => {
  if (form.value.name && form.value.email) {
    emit('submit', { ...form.value })
  }
}
</script>

<template>
  <UiModal :is-open="isOpen" title="Tambah Pengguna Baru" @close="emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Nama Lengkap</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Masukkan nama..."
          class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Alamat Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="contoh@admin.uwn.id"
          class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-zinc-550 dark:text-zinc-450 mb-1">Peranan (Role)</label>
        <select
          v-model="form.role"
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
          v-model="form.status"
          class="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none dark:text-white"
        >
          <option value="Active">Aktif</option>
          <option value="Inactive">Nonaktif</option>
        </select>
      </div>

      <div class="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <UiButton variant="outline" @click="emit('close')">
          Batal
        </UiButton>
        <UiButton type="submit" variant="primary">
          Simpan Pengguna
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
