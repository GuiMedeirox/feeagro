import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'pending' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-brand-400/15 text-brand-300 border-brand-400/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
  warning: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
  pending: 'bg-pending/15 text-pending border-pending/30',
  default: 'bg-brand-700 text-muted border-brand-600',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
