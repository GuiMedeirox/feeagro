import { cn } from '@/lib/utils'
import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-cream-200">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full bg-brand-900 border rounded-lg px-3 py-2 text-sm text-cream-100',
            'outline-none focus:ring-2 focus:ring-brand-400 transition-all appearance-none cursor-pointer',
            error
              ? 'border-danger/60 focus:ring-danger/40'
              : 'border-brand-600 focus:border-brand-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" style={{ background: '#0c1a10' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#0c1a10' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
