'use client'

import { useDashboardSummary } from '@/hooks/use-dashboard'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { KycStatusCard } from '@/components/dashboard/kyc-status'
import { RWAPortfolio } from '@/components/dashboard/rwa-portfolio'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { ErrorState } from '@/components/ui/error-state'

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardSummary()

  if (isLoading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <ErrorState
        message="Não foi possível carregar o dashboard."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Balance + KYC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BalanceCard
          availableBalance={data.account.availableBalance}
          totalPortfolioValue={data.totalPortfolioValue}
          currency={data.account.currency}
        />
        <KycStatusCard status={data.kycStatus} />
      </div>

      {/* Row 2: Portfolio + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RWAPortfolio assets={data.rwaAssets} />
        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </div>
  )
}
