'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { href: '/operations/new', label: 'Operar', icon: PlusCircle },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-900 border-t border-brand-700 px-2 pb-safe md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-5 rounded-xl transition-colors min-w-0',
                active ? 'text-brand-300' : 'text-muted'
              )}
            >
              <Icon className="size-5 flex-shrink-0" />
              <span className="text-[10px] font-medium leading-none truncate">{label}</span>
              {active && <div className="size-1 rounded-full bg-brand-400 mt-0.5" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
