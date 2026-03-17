import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-brand-400 text-brand-950 hover:bg-brand-300 active:bg-brand-500':
              variant === 'primary',
            'bg-brand-800 text-cream-100 border border-brand-600 hover:bg-brand-700 active:bg-brand-700':
              variant === 'secondary',
            'text-cream-200 hover:bg-brand-800 hover:text-cream-100':
              variant === 'ghost',
            'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20':
              variant === 'danger',
            // Sizes
            'text-xs px-3 py-1.5 h-7': size === 'sm',
            'text-sm px-4 py-2 h-9': size === 'md',
            'text-base px-6 py-3 h-12': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
