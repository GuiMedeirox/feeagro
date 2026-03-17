import { ArrowDownLeft, ArrowUpRight, TrendingUp, Calendar, Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Transaction } from '@feeagro/shared'

const typeConfig = {
  DEPOSIT: { icon: ArrowDownLeft, color: 'text-brand-300', label: 'Depósito' },
  WITHDRAWAL: { icon: ArrowUpRight, color: 'text-danger', label: 'Saque' },
  TRANSFER: { icon: ArrowUpRight, color: 'text-gold-400', label: 'Transferência' },
  INVESTMENT: { icon: TrendingUp, color: 'text-gold-400', label: 'Investimento' },
}

const statusVariant = {
  COMPLETED: 'success',
  PENDING: 'pending',
  FAILED: 'danger',
} as const

const statusLabel = { COMPLETED: 'Concluído', PENDING: 'Pendente', FAILED: 'Falhou' }

interface TransactionDetailProps {
  transaction: Transaction
}

export function TransactionDetail({ transaction: tx }: TransactionDetailProps) {
  const config = typeConfig[tx.type as keyof typeof typeConfig]
  const Icon = config?.icon ?? ArrowDownLeft
  const isOut = tx.type !== 'DEPOSIT'
  const meta = tx.metadata as Record<string, string> | undefined

  return (
    <div className="flex flex-col gap-5">
      {/* Amount hero */}
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <div className={`size-16 rounded-2xl bg-brand-900 flex items-center justify-center`}>
            <Icon className={`size-8 ${config?.color ?? 'text-muted'}`} />
          </div>
        </div>
        <p className={`font-display text-3xl font-bold tabular-nums ${isOut ? 'text-cream-100' : 'text-brand-300'}`}>
          {isOut ? '-' : '+'}{formatCurrency(tx.amount)}
        </p>
        <p className="text-muted text-sm mt-1">{config?.label ?? tx.type}</p>
      </div>

      {/* Status */}
      <div className="flex justify-center">
        <Badge variant={statusVariant[tx.status as keyof typeof statusVariant] ?? 'default'} className="text-sm px-4 py-1.5">
          {statusLabel[tx.status as keyof typeof statusLabel] ?? tx.status}
        </Badge>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 p-4 bg-brand-900/50 rounded-xl border border-brand-700">
        <DetailRow label="Descrição" value={tx.description} />
        <DetailRow label="Data" value={formatDateTime(tx.createdAt)} icon={<Calendar className="size-3 text-muted" />} />
        <DetailRow label="ID" value={tx.id.slice(0, 20) + '...'} icon={<Hash className="size-3 text-muted" />} mono />
        {meta?.beneficiary && <DetailRow label="Beneficiário" value={meta.beneficiary} />}
        {meta?.memo && <DetailRow label="Memo" value={meta.memo} />}
        {meta?.assetSymbol && <DetailRow label="Ativo" value={`${meta.assetSymbol} — ${Number(meta.tokensAcquired).toFixed(4)} tokens`} />}
        {meta?.pricePerUnit && <DetailRow label="Preço/token" value={formatCurrency(Number(meta.pricePerUnit))} />}
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  icon,
  mono,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-brand-700/50 last:border-0">
      <span className="text-xs text-muted flex-shrink-0 flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className={`text-sm text-cream-100 text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}
