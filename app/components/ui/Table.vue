<script setup>
defineProps({
  headers: {
    type: Array,
    required: true // e.g. ['Nama', 'Email', 'Role', 'Status', 'Aksi']
  },
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/10">
          <th v-for="header in headers" :key="header" class="px-6 py-4">{{ header }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-205 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-350">
        <tr
          v-for="(item, index) in items"
          :key="index"
          class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
        >
          <slot :item="item" :index="index" />
        </tr>
        <tr v-if="items.length === 0">
          <td :colspan="headers.length" class="px-6 py-10 text-center text-zinc-500">
            Tidak ada data yang tersedia.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
