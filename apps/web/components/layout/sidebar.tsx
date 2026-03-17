'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, PlusCircle, Wheat, LogOut, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { href: '/operations/new', label: 'Nova Operação', icon: PlusCircle },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-brand-900 border-r border-brand-700 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-brand-700', collapsed && 'justify-center px-0')}>
        <div className="flex-shrink-0 size-9 rounded-xl bg-brand-400/20 border border-brand-400/40 flex items-center justify-center">
          <Wheat className="size-5 text-brand-300" />
        </div>
        {!collapsed && (
          <div className="leading-none">
            <span className="font-display font-bold text-cream-100 tracking-tight">fee</span>
            <span className="font-display font-bold text-brand-300 tracking-tight">Agro</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                active
                  ? 'bg-brand-400/15 text-brand-300 font-medium'
                  : 'text-muted hover:bg-brand-800 hover:text-cream-200',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon className={cn('flex-shrink-0 size-5', active ? 'text-brand-300' : 'text-current')} />
              {!collapsed && <span className="text-sm">{label}</span>}
              {active && !collapsed && (
                <div className="ml-auto size-1.5 rounded-full bg-brand-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className={cn('p-3 border-t border-brand-700', collapsed ? 'items-center' : '')}>
        {!collapsed && user && (
          <div className="px-2 py-2 mb-2">
            <p className="text-xs font-medium text-cream-200 truncate">{user.name}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-muted hover:bg-danger/10 hover:text-danger',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="size-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sair</span>}
        </button>
      </div>
    </aside>
  )
}
