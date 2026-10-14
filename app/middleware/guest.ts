export default defineNuxtRouteMiddleware(async () => {
  const { user, token, fetchMe, isStaff } = useAuth()

  if (token.value) {
    if (!user.value) {
      await fetchMe()
    }

    if (user.value) {
      if (isStaff.value) {
        return navigateTo('/admin')
      }
      return navigateTo('/my-tickets')
    }
  }
})
