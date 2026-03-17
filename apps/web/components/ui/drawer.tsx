'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-brand-950/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-brand-800 border-t border-brand-700',
          'rounded-t-3xl max-h-[85vh] overflow-y-auto',
          'animate-in slide-in-from-bottom duration-300'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-brand-600 rounded-full" />
        </div>

        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-brand-700">
            <h2 className="font-display font-semibold text-cream-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-cream-100 hover:bg-brand-700 transition-colors"
              aria-label="Fechar"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="p-5 pb-8">{children}</div>
      </div>
    </div>
  )
}
