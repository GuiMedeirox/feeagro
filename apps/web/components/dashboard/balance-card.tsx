'use client'

import { useState } from 'react'
import { Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface BalanceCardProps {
  availableBalance: number
  totalPortfolioValue: number
  currency?: string
}

export function BalanceCard({ availableBalance, totalPortfolioValue, currency = 'BRL' }: BalanceCardProps) {
  const [visible, setVisible] = useState(true)
  const totalAssets = availableBalance + totalPortfolioValue

  return (
    <Card accent className="col-span-full lg:col-span-2">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-brand-400/10 flex items-center justify-center">
              <Wallet className="size-4 text-brand-300" />
            </div>
            <span className="text-sm font-medium text-muted">Patrimônio Total</span>
          </div>
          <button
            onClick={() => setVisible((v) => !v)}
            className="p-1.5 rounded-lg text-muted hover:text-cream-100 hover:bg-brand-700 transition-colors"
            aria-label={visible ? 'Ocultar saldo' : 'Mostrar saldo'}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Main balance */}
        <div className="mb-6">
          <p className="font-display text-4xl font-bold text-cream-100 tabular-nums">
            {visible ? formatCurrency(totalAssets, currency) : 'R$ ••••••'}
          </p>
          <p className="text-sm text-muted mt-1">Total em custódia ({currency})</p>
        </div>

        {/* Sub-balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-brand-900/60 border border-brand-700">
            <p className="text-xs text-muted mb-1">Disponível</p>
            <p className="font-display font-semibold text-cream-100 tabular-nums">
              {visible ? formatCurrency(availableBalance, currency) : '••••••'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-brand-900/60 border border-brand-700">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="size-3 text-brand-300" />
              <p className="text-xs text-muted">Portfolio RWA</p>
            </div>
            <p className="font-display font-semibold text-gold-400 tabular-nums">
              {visible ? formatCurrency(totalPortfolioValue, currency) : '••••••'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
