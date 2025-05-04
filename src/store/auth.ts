import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/types/jwt-payload'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token')
    let payload: JwtPayload | null = null
    if (token) {
      try {
        payload = jwtDecode<JwtPayload>(token)
      } catch {
        payload = null
      }
    }
    return {
      token,
      payload,
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    userId: state => state.payload?.sub ?? null,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      try {
        this.payload = jwtDecode<JwtPayload>(token)
      } catch {
        this.payload = null
      }
    },
    logout() {
      this.token = null
      this.payload = null
      localStorage.removeItem('token')
    },
  },
})
