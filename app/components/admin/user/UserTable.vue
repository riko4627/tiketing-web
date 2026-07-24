<script setup>
defineProps({
  users: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <UiCard no-padding>
    <UiTable
      :headers="['Nama Lengkap', 'Email', 'Peranan', 'Status', 'Bergabung Pada', 'Aksi']"
      :items="users"
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
            @click="emit('delete', item.id)"
          >
            Hapus
          </button>
        </td>
      </template>
    </UiTable>
  </UiCard>
</template>
