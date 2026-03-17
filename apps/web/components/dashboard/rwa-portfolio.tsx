import Link from 'next/link'
import { TrendingUp, Sprout, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatQuantity } from '@/lib/utils'
import type { RWAAsset } from '@feeagro/shared'

const assetIcons: Record<string, string> = {
  SOJA: '🌱',
  MILHO: '🌽',
}

interface RWAPortfolioProps {
  assets: RWAAsset[]
}

export function RWAPortfolio({ assets }: RWAPortfolioProps) {
  const total = assets.reduce((sum, a) => sum + a.totalValue, 0)

  return (
    <Card className="col-span-full">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <Sprout className="size-4 text-gold-400" />
            </div>
            <span className="font-display font-semibold text-cream-100">Portfolio RWA</span>
          </div>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-xs text-brand-300 hover:text-brand-200 transition-colors"
          >
            Ver tudo <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Total */}
        <div className="mb-4 p-3 rounded-xl bg-brand-900/50 border border-brand-700">
          <p className="text-xs text-muted mb-1">Valor total tokenizado</p>
          <p className="font-display text-xl font-bold text-gold-400 tabular-nums">
            {formatCurrency(total)}
          </p>
        </div>

        {/* Asset list */}
        <div className="flex flex-col gap-2">
          {assets.map((asset) => {
            const pct = total > 0 ? (asset.totalValue / total) * 100 : 0
            return (
              <div
                key={asset.id}
                className="p-3 rounded-xl bg-brand-900/40 border border-brand-700 hover:border-brand-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{assetIcons[asset.tokenSymbol] ?? '🌾'}</span>
                    <div>
                      <p className="text-sm font-medium text-cream-100">{asset.assetName}</p>
                      <p className="text-xs text-muted">{asset.tokenSymbol} · {formatQuantity(asset.quantity, 2)} tokens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cream-100 tabular-nums">
                      {formatCurrency(asset.totalValue)}
                    </p>
                    <p className="text-xs text-muted tabular-nums">
                      {formatCurrency(asset.pricePerUnit)}/token
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-brand-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-400 to-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-muted">{pct.toFixed(1)}% do portfolio</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
