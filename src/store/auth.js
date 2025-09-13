import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async login(credentials) {
      try {
        const res = await axios.post(
          (import.meta.env.VITE_API_BASE_URL || 'https://www.naikula.co.ke') + '/api/login',
          credentials
        )

        const token = res.data.token
        const user = res.data.user ?? null

        this.setToken(token)
        this.setUser(user)

        return user
      } catch (err) {
        throw err
      }
    },

    async register(data) {
      try {
        const res = await axios.post(
          (import.meta.env.VITE_API_BASE_URL || 'https://www.naikula.co.ke') + '/api/register',
          data
        )

        const token = res.data.token
        const user = res.data.user ?? null

        this.setToken(token)
        this.setUser(user)

        return user
      } catch (err) {
        throw err
      }
    },

    logout() {
      try {
        axios.post(
          (import.meta.env.VITE_API_BASE_URL || 'https://www.naikula.co.ke') + '/api/logout',
          {},
          { headers: { Authorization: this.token ? `Bearer ${this.token}` : undefined } }
        ).catch(() => {})
      } catch (e) {}

      this.clearToken()
      this.user = null
      localStorage.removeItem('user')
    },

    setToken(token) {
      this.token = token
      if (token) localStorage.setItem('token', token)
      else localStorage.removeItem('token')
    },

    clearToken() {
      this.token = null
      localStorage.removeItem('token')
    },

    setUser(user) {
      this.user = user
      if (user) localStorage.setItem('user', JSON.stringify(user))
      else localStorage.removeItem('user')
    },
  },
})

export function getToken() {
  const t = localStorage.getItem('token')
  if (t) return t

  try {
    const { useAuthStore } = require('./auth')
    const store = useAuthStore()
    return store?.token || null
  } catch (e) {
    return null
  }
}
