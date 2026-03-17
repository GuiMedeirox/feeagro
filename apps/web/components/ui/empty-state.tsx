import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title = 'Nenhum resultado',
  description = 'Não há dados para exibir no momento.',
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-4 text-center', className)}>
      <div className="p-4 rounded-full bg-brand-800 text-muted">
        {icon ?? <Inbox className="size-8" />}
      </div>
      <div>
        <p className="font-semibold text-cream-100">{title}</p>
        <p className="text-sm text-muted mt-1 max-w-xs">{description}</p>
      </div>
      {action}
    </div>
  )
}
