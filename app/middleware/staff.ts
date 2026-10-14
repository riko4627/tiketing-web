export default defineNuxtRouteMiddleware(async () => {
  const { user, token, fetchMe, isStaff } = useAuth()

  if (!token.value) {
    return navigateTo('/login')
  }

  if (!user.value) {
    await fetchMe()
  }

  if (!isStaff.value) {
    return navigateTo('/my-tickets')
  }
})
