<script setup>
defineProps({
  type: {
    type: String,
    default: 'info' // success, warning, danger, info
  },
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    :class="[
      'p-4 rounded-xl border flex items-start gap-3.5 text-sm',
      type === 'success' && 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-400',
      type === 'warning' && 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-400',
      type === 'danger' && 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-450',
      type === 'info' && 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 text-indigo-800 dark:text-indigo-400'
    ]"
  >
    <!-- Icon Selector -->
    <div class="flex-shrink-0 mt-0.5">
      <svg v-if="type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else-if="type === 'warning'" class="w-5 h-5 text-amber-600 dark:text-amber-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <svg v-else-if="type === 'danger'" class="w-5 h-5 text-rose-600 dark:text-rose-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h5 v-if="title" class="font-bold mb-1">{{ title }}</h5>
      <div class="text-zinc-600 dark:text-zinc-405 leading-relaxed">
        <slot />
      </div>
    </div>
  </div>
</template>
