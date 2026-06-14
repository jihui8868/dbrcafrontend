import { create } from 'zustand'
import { User } from '../types'
import { apiClient } from '../services/api'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  register: (username: string, email: string, password: string) => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),

  register: async (username, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const user = await apiClient.register(username, email, password)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.login(username, password)
      apiClient.setToken(response.access_token)
      const user = await apiClient.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    apiClient.clearAuth()
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isAuthenticated: false, user: null })
      return
    }

    try {
      apiClient.setToken(token)
      const user = await apiClient.getCurrentUser()
      set({ user, isAuthenticated: true })
    } catch (error) {
      set({ isAuthenticated: false, user: null })
      apiClient.clearAuth()
    }
  },
}))
