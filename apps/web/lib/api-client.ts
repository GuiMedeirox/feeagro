import axios, { type AxiosError } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Token storage in memory (not localStorage — avoids XSS)
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

// Request interceptor — attach token
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor — só tenta refresh quando havia token em memória
// (token expirou mid-session). Se accessToken é null, o 401 é esperado
// (usuário não autenticado) e propagamos o erro normalmente.
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !original?._retry && accessToken !== null) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original!.headers!.Authorization = `Bearer ${token}`
            resolve(apiClient(original!))
          })
        })
      }

      original!._retry = true
      isRefreshing = true

      try {
        const { data } = await apiClient.post<{ accessToken: string }>('/auth/refresh', {})
        setAccessToken(data.accessToken)
        refreshQueue.forEach((cb) => cb(data.accessToken))
        refreshQueue = []
        original!.headers!.Authorization = `Bearer ${data.accessToken}`
        return apiClient(original!)
      } catch {
        setAccessToken(null)
        refreshQueue = []
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
