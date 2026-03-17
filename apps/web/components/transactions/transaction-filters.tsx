'use client'

import { useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TransactionFilters } from '@feeagro/shared'

interface TransactionFiltersProps {
  filters: Partial<TransactionFilters>
  onChange: (filters: Partial<TransactionFilters>) => void
}

const typeOptions = [
  { value: '', label: 'Todos os tipos' },
  { value: 'DEPOSIT', label: 'Depósito' },
  { value: 'WITHDRAWAL', label: 'Saque' },
  { value: 'TRANSFER', label: 'Transferência' },
  { value: 'INVESTMENT', label: 'Investimento' },
]

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'FAILED', label: 'Falhou' },
]

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

  const handleSearch = (value: string) => {
    setSearchInput(value)
    const timeout = setTimeout(() => {
      onChange({ ...filters, search: value || undefined, page: 1 })
    }, 400)
    return () => clearTimeout(timeout)
  }

  const hasActiveFilters = filters.type || filters.status || filters.search

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar transações..."
            className="w-full bg-brand-800 border border-brand-700 rounded-xl pl-9 pr-3 py-2 text-sm text-cream-100 placeholder:text-muted outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
          />
        </div>

        {/* Type filter */}
        <select
          value={filters.type ?? ''}
          onChange={(e) => onChange({ ...filters, type: (e.target.value as TransactionFilters['type']) || undefined, page: 1 })}
          className="bg-brand-800 border border-brand-700 rounded-xl px-3 py-2 text-sm text-cream-100 outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer appearance-none"
          style={{ background: '#14261a' }}
        >
          {typeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filters.status ?? ''}
          onChange={(e) => onChange({ ...filters, status: (e.target.value as TransactionFilters['status']) || undefined, page: 1 })}
          className="bg-brand-800 border border-brand-700 rounded-xl px-3 py-2 text-sm text-cream-100 outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer appearance-none"
          style={{ background: '#14261a' }}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchInput('')
              onChange({ sortBy: 'createdAt', sortOrder: 'desc', page: 1, limit: 10 })
            }}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-danger transition-colors px-2 py-1"
          >
            <X className="size-3" />
            Limpar
          </button>
        )}
      </div>
    </div>
  )
}
