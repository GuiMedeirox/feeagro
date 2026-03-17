import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, relativeDate } from '@/lib/utils'
import type { Transaction } from '@feeagro/shared'

const typeConfig = {
  DEPOSIT: { icon: ArrowDownLeft, color: 'text-brand-300', sign: '+' },
  WITHDRAWAL: { icon: ArrowUpRight, color: 'text-danger', sign: '-' },
  TRANSFER: { icon: ArrowUpRight, color: 'text-gold-400', sign: '-' },
  INVESTMENT: { icon: TrendingUp, color: 'text-gold-400', sign: '-' },
}

const statusVariant = {
  COMPLETED: 'success',
  PENDING: 'pending',
  FAILED: 'danger',
} as const

const statusLabel = {
  COMPLETED: 'Concluído',
  PENDING: 'Pendente',
  FAILED: 'Falhou',
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="col-span-full">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-semibold text-cream-100">Últimas Transações</span>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-xs text-brand-300 hover:text-brand-200 transition-colors"
          >
            Ver todas <ArrowRight className="size-3" />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">Nenhuma transação recente.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {transactions.map((tx) => {
              const config = typeConfig[tx.type as keyof typeof typeConfig]
              const Icon = config?.icon ?? ArrowDownLeft
              const isOut = tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER' || tx.type === 'INVESTMENT'

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-700/40 transition-colors"
                >
                  <div className={`size-9 rounded-xl bg-brand-900 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`size-4 ${config?.color ?? 'text-muted'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream-100 truncate">{tx.description}</p>
                    <p className="text-xs text-muted">{relativeDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold tabular-nums ${isOut ? 'text-cream-300' : 'text-brand-300'}`}>
                      {isOut ? '-' : '+'}{formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={statusVariant[tx.status as keyof typeof statusVariant] ?? 'default'} className="mt-0.5">
                      {statusLabel[tx.status as keyof typeof statusLabel] ?? tx.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
