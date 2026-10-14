export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'agent' | 'admin'
  phone?: string | null
  department?: string | null
  created_at?: string
}

export const useAuth = () => {
  const { apiFetch, token } = useApi()
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState<boolean>('auth_loading', () => false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isAgent = computed(() => user.value?.role === 'agent')
  const isUser = computed(() => user.value?.role === 'user')
  const isStaff = computed(() => user.value?.role === 'admin' || user.value?.role === 'agent')

  const fetchMe = async (): Promise<User | null> => {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      isLoading.value = true
      const response = await apiFetch<{ data: User }>('/auth/me')
      user.value = response.data
      return user.value
    } catch {
      token.value = null
      user.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true
    try {
      const response = await apiFetch<{
        message: string
        data: {
          user: User
          token: string
        }
      }>('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      token.value = response.data.token
      user.value = response.data.user

      return response.data
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: {
    name: string
    email: string
    password: string
    phone?: string
    department?: string
  }) => {
    isLoading.value = true
    try {
      const response = await apiFetch<{
        message: string
        data: {
          user: User
          token: string
        }
      }>('/auth/register', {
        method: 'POST',
        body: payload,
      })

      token.value = response.data.token
      user.value = response.data.user

      return response.data
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
      }
    } finally {
      token.value = null
      user.value = null
      await navigateTo('/login')
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    isAgent,
    isUser,
    isStaff,
    fetchMe,
    login,
    register,
    logout,
  }
}
