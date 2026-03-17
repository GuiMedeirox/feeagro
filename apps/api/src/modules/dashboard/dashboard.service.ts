import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/api-error.js'

export class DashboardService {
  async getSummary(userId: string) {
    const account = await prisma.account.findUnique({
      where: { userId },
      include: {
        rwaAssets: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!account) throw new NotFoundError('Conta')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    })

    if (!user) throw new NotFoundError('Usuário')

    const rwaAssets = account.rwaAssets.map((asset) => ({
      id: asset.id,
      accountId: asset.accountId,
      assetName: asset.assetName,
      tokenSymbol: asset.tokenSymbol,
      quantity: Number(asset.quantity),
      pricePerUnit: Number(asset.pricePerUnit),
      totalValue: Number(asset.quantity) * Number(asset.pricePerUnit),
    }))

    const totalPortfolioValue = rwaAssets.reduce((sum, a) => sum + a.totalValue, 0)

    return {
      account: {
        id: account.id,
        userId: account.userId,
        currency: account.currency,
        availableBalance: Number(account.availableBalance),
      },
      rwaAssets,
      kycStatus: user.kycStatus,
      recentTransactions: account.transactions.map(this.serializeTransaction),
      totalPortfolioValue,
    }
  }

  private serializeTransaction(tx: {
    id: string
    accountId: string
    type: string
    status: string
    amount: { toString(): string }
    description: string
    metadata: unknown
    createdAt: Date
  }) {
    return {
      id: tx.id,
      accountId: tx.accountId,
      type: tx.type,
      status: tx.status,
      amount: Number(tx.amount),
      description: tx.description,
      metadata: tx.metadata as Record<string, unknown> | undefined,
      createdAt: tx.createdAt.toISOString(),
    }
  }
}
