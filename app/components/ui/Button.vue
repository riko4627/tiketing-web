<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary' // primary, secondary, outline, danger
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      // Sizes
      size === 'sm' && 'px-3 py-1.5 text-xs',
      size === 'md' && 'px-4 py-2.5 text-xs',
      size === 'lg' && 'px-5 py-3 text-sm',
      // Variants
      variant === 'primary' && 'bg-indigo-605 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-150 focus:ring-indigo-500',
      variant === 'secondary' && 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 focus:ring-zinc-500',
      variant === 'outline' && 'bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:ring-zinc-500',
      variant === 'danger' && 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500'
    ]"
  >
    <slot />
  </button>
</template>
