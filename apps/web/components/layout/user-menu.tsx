'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut, Plus, Wallet } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useDashboardSummary } from '@/hooks/use-dashboard'
import { formatCurrency } from '@/lib/utils'

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { data: summary } = useDashboardSummary()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    router.push('/login')
  }

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-brand-800 transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="size-7 rounded-full bg-brand-400/20 border border-brand-400/40 flex items-center justify-center">
          <span className="text-xs font-bold text-brand-300">{initials}</span>
        </div>
        <span className="hidden sm:block text-sm text-cream-200">{user?.name?.split(' ')[0]}</span>
        <ChevronDown className={`size-3 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-52 bg-brand-800 border border-brand-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-4 py-3 border-b border-brand-700">
            <p className="text-sm font-medium text-cream-100 truncate">{user?.name}</p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>

          {summary && (
            <div className="px-4 py-3 border-b border-brand-700 flex items-center gap-2.5">
              <Wallet className="size-3.5 text-brand-300 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted uppercase tracking-wide leading-none mb-0.5">Saldo disponível</span>
                <span className="text-sm font-semibold text-cream-100 tabular-nums">
                  {formatCurrency(summary.account.availableBalance)}
                </span>
              </div>
            </div>
          )}
          <div className="p-1.5 flex flex-col gap-0.5">
            <button
              role="menuitem"
              onClick={() => { setOpen(false); router.push('/deposit') }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-cream-200 hover:bg-brand-700 hover:text-cream-100 transition-colors text-left"
            >
              <Plus className="size-4 text-brand-300" />
              Depositar saldo
            </button>
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-muted hover:bg-danger/10 hover:text-danger transition-colors text-left"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
