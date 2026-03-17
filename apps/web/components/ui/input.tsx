import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-cream-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-brand-900 border rounded-lg px-3 py-2 text-sm text-cream-100 placeholder:text-muted',
            'outline-none focus:ring-2 focus:ring-brand-400 transition-all',
            error
              ? 'border-danger/60 focus:ring-danger/40'
              : 'border-brand-600 focus:border-brand-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
