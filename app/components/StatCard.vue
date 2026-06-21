<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  change: {
    type: String,
    required: true
  },
  isPositive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: 'indigo' // indigo, green, amber, rose
  }
})
</script>

<template>
  <div class="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ title }}</span>
      
      <!-- Icon Wrapper -->
      <div
        :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center',
          color === 'indigo' && 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
          color === 'green' && 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
          color === 'amber' && 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
          color === 'rose' && 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
        ]"
      >
        <slot name="icon">
          <!-- Default fallback icon -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </slot>
      </div>
    </div>

    <div class="mt-4 flex items-baseline gap-2">
      <span class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{{ value }}</span>
      <span
        :class="[
          'text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5',
          isPositive
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
        ]"
      >
        <svg v-if="isPositive" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
        </svg>
        {{ change }}
      </span>
    </div>
  </div>
</template>
