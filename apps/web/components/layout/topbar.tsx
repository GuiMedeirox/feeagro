'use client'

import { usePathname } from 'next/navigation'
import { Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/operations/new': 'Nova Operação',
}

export function Topbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const title = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'FeeAgro'

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

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

        <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-brand-800 cursor-pointer transition-colors">
          <div className="size-7 rounded-full bg-brand-400/20 border border-brand-400/40 flex items-center justify-center">
            <span className="text-xs font-bold text-brand-300">{initials}</span>
          </div>
          <span className="hidden sm:block text-sm text-cream-200">{user?.name?.split(' ')[0]}</span>
          <ChevronDown className="size-3 text-muted" />
        </div>
      </div>
    </header>
  )
}
