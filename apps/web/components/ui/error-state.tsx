import { AlertTriangle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  message = 'Ocorreu um erro ao carregar os dados.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-4 text-center', className)}>
      <div className="p-4 rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="size-8" />
      </div>
      <div>
        <p className="font-semibold text-cream-100">Algo deu errado</p>
        <p className="text-sm text-muted mt-1 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
