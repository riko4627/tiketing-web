export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })

  const apiFetch = async <T = any>(
    endpoint: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const fullUrl = `${config.public.apiBase}${cleanEndpoint}`

    try {
      return await $fetch<T>(fullUrl, {
        ...options,
        headers,
      })
    } catch (err: any) {
      // Extract Laravel validation & error messages
      const status = err.response?.status
      const errorData = err.response?._data || {}

      const formattedError = {
        status,
        message: errorData.message || err.message || 'Terjadi kesalahan pada sistem server.',
        errors: errorData.errors || {},
        original: err,
      }

      // If token expired / unauthorized (401), clear token
      if (status === 401) {
        token.value = null
      }

      throw formattedError
    }
  }

  return {
    apiFetch,
    token,
  }
}
