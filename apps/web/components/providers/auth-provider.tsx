'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient, setAccessToken } from '@/lib/api-client'
import { AuthContext } from '@/hooks/use-auth'
import type { User } from '@feeagro/shared'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get<{ user: User }>('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<{ user: User; accessToken: string }>('/auth/login', {
      email,
      password,
    })
    setAccessToken(data.accessToken)
    setUser(data.user)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await apiClient.post<{ user: User; accessToken: string }>('/auth/register', {
      name,
      email,
      password,
    })
    setAccessToken(data.accessToken)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await apiClient.post('/auth/logout', {}).catch(() => {})
    setAccessToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
