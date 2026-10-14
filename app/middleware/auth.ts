export default defineNuxtRouteMiddleware(async (to) => {
  const { user, token, fetchMe } = useAuth()

  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  // Restore user info if token exists but user state is not loaded yet
  if (!user.value) {
    const fetched = await fetchMe()
    if (!fetched) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }
  }
})
