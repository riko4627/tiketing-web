<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  noPadding: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Card Header -->
    <div
      v-if="title || $slots.header"
      class="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/10"
    >
      <div>
        <h3 v-if="title" class="font-bold text-zinc-900 dark:text-white">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{{ subtitle }}</p>
      </div>
      <div>
        <slot name="header" />
      </div>
    </div>

    <!-- Card Body -->
    <div :class="[noPadding ? '' : 'p-6']">
      <slot />
    </div>
  </div>
</template>
