import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  accent?: boolean
}

export function Card({ className, children, accent }: CardProps) {
  return (
    <div
      className={cn(
        'relative bg-brand-800 rounded-2xl border border-brand-700 overflow-hidden',
        accent && 'border-t-2 border-t-gold-500',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-5', className)}>{children}</div>
}
