'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { UserMenu } from './user-menu'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/operations/new': 'Nova Operação',
  '/deposit': 'Depositar Saldo',
}

export function Topbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const title = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'FeeAgro'

  return (
    <header className="h-14 flex items-center justify-between px-5 bg-brand-900/60 backdrop-blur border-b border-brand-700/50">
      <div className="flex items-center gap-3">
        <h1 className="font-display font-semibold text-cream-100">{title}</h1>
        {user?.kycStatus === 'VERIFIED' && (
          <Badge variant="success" className="hidden sm:inline-flex">
            KYC Verificado
          </Badge>
        )}
        {user?.kycStatus === 'PENDING' && (
          <Badge variant="warning" className="hidden sm:inline-flex">
            KYC Pendente
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg text-muted hover:bg-brand-800 hover:text-cream-100 transition-colors"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
        </button>

        <UserMenu />
      </div>
    </header>
  )
}
