'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal
        className={cn(
          'relative z-10 w-full max-w-lg bg-brand-800 border border-brand-700 rounded-2xl shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-700">
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
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
