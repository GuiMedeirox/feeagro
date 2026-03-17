'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient, setAccessToken } from '@/lib/api-client'
import { AuthContext } from '@/hooks/use-auth'
import type { User } from '@feeagro/shared'

async function restoreSession(): Promise<User | null> {
  // Tenta carregar o usuário com o token atual (se houver)
  try {
    const { data } = await apiClient.get<{ user: User }>('/auth/me')
    return data.user
  } catch {
    // /auth/me falhou — tenta renovar via refresh token (cookie httpOnly)
  }

  try {
    const { data } = await apiClient.post<{ user: User; accessToken: string }>('/auth/refresh', {})
    setAccessToken(data.accessToken)
    return data.user
  } catch {
    // Refresh também falhou — não há sessão ativa
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    restoreSession()
      .then(setUser)
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
