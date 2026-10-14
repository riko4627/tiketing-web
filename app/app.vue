<script setup>
const { fetchMe, token } = useAuth()

onMounted(() => {
  if (token.value) {
    fetchMe()
  }
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
