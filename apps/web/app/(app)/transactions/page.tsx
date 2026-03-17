'use client'

import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, TrendingUp, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useTransactions, useTransaction } from '@/hooks/use-transactions'
import { useIsDesktop } from '@/hooks/use-media-query'
import { TransactionFiltersBar } from '@/components/transactions/transaction-filters'
import { TransactionDetail } from '@/components/transactions/transaction-detail'
import { Modal } from '@/components/ui/modal'
import { Drawer } from '@/components/ui/drawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { formatCurrency, relativeDate } from '@/lib/utils'
import type { Transaction, TransactionFilters } from '@feeagro/shared'

const typeConfig = {
  DEPOSIT: { icon: ArrowDownLeft, color: 'text-brand-300', label: 'Depósito' },
  WITHDRAWAL: { icon: ArrowUpRight, color: 'text-danger', label: 'Saque' },
  TRANSFER: { icon: ArrowUpRight, color: 'text-gold-400', label: 'Transferência' },
  INVESTMENT: { icon: TrendingUp, color: 'text-gold-400', label: 'Investimento' },
}

const statusVariant = { COMPLETED: 'success', PENDING: 'pending', FAILED: 'danger' } as const
const statusLabel = { COMPLETED: 'Concluído', PENDING: 'Pendente', FAILED: 'Falhou' }

export default function TransactionsPage() {
  const isDesktop = useIsDesktop()
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data, isLoading, isFetching, error, refetch } = useTransactions(filters)
  const { data: selectedTx } = useTransaction(selectedId)

  const handleRowClick = (tx: Transaction) => setSelectedId(tx.id)
  const handleClose = () => setSelectedId(null)

  const totalPages = data?.meta.totalPages ?? 1
  const currentPage = filters.page ?? 1

  return (
    <div className="flex flex-col gap-4">
      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      {/* Table / List */}
      <div className="bg-brand-800 rounded-2xl border border-brand-700 overflow-hidden">
        {/* Loading indicator */}
        {isFetching && !isLoading && (
          <div className="flex items-center justify-center gap-2 py-2 bg-brand-700/30 text-xs text-muted">
            <Loader2 className="size-3 animate-spin" />
            Atualizando...
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-px p-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => refetch()} className="py-12" />
        ) : !data?.data.length ? (
          <EmptyState
            title="Nenhuma transação encontrada"
            description="Tente ajustar os filtros ou realize uma operação."
            className="py-12"
          />
        ) : (
          <>
            {/* Desktop: Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-2 border-b border-brand-700 text-xs text-muted uppercase tracking-wide">
              <span>Descrição</span>
              <span>Tipo</span>
              <span>Status</span>
              <span className="text-right">Valor</span>
            </div>

            {data.data.map((tx) => {
              const config = typeConfig[tx.type as keyof typeof typeConfig]
              const Icon = config?.icon ?? ArrowDownLeft
              const isOut = tx.type !== 'DEPOSIT'

              return (
                <button
                  key={tx.id}
                  onClick={() => handleRowClick(tx)}
                  className="w-full flex items-center gap-3 md:grid md:grid-cols-[2fr_1fr_1fr_1fr] px-4 py-3 border-b border-brand-700/50 last:border-0 hover:bg-brand-700/30 transition-colors text-left"
                >
                  {/* Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-xl bg-brand-900 flex items-center justify-center flex-shrink-0">
                      <Icon className={`size-4 ${config?.color ?? 'text-muted'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-cream-100 truncate">{tx.description}</p>
                      <p className="text-xs text-muted">{relativeDate(tx.createdAt)}</p>
                    </div>
                  </div>

                  {/* Type — hidden on mobile, shown in description */}
                  <span className="hidden md:block text-xs text-muted">{config?.label ?? tx.type}</span>

                  {/* Status */}
                  <div className="hidden md:block">
                    <Badge variant={statusVariant[tx.status as keyof typeof statusVariant] ?? 'default'}>
                      {statusLabel[tx.status as keyof typeof statusLabel] ?? tx.status}
                    </Badge>
                  </div>

                  {/* Amount */}
                  <p className={`ml-auto md:ml-0 text-sm font-semibold tabular-nums text-right ${isOut ? 'text-cream-200' : 'text-brand-300'}`}>
                    {isOut ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                </button>
              )
            })}
          </>
        )}

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand-700">
            <p className="text-xs text-muted">
              {data.meta.total} transações · pág. {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: currentPage - 1 }))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: currentPage + 1 }))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail — Modal on desktop, Drawer on mobile */}
      {isDesktop ? (
        <Modal
          open={!!selectedId && !!selectedTx}
          onClose={handleClose}
          title="Detalhes da Transação"
        >
          {selectedTx && <TransactionDetail transaction={selectedTx} />}
        </Modal>
      ) : (
        <Drawer
          open={!!selectedId && !!selectedTx}
          onClose={handleClose}
          title="Detalhes da Transação"
        >
          {selectedTx && <TransactionDetail transaction={selectedTx} />}
        </Drawer>
      )}
    </div>
  )
}
