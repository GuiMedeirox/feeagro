import { prisma } from '../../config/database.js'
import { BadRequestError, NotFoundError } from '../../utils/api-error.js'
import type { DepositInput, InvestmentInput, TransferInput } from '@feeagro/shared'

export class OperationsService {
  async transfer(userId: string, input: TransferInput) {
    const account = await prisma.account.findUnique({ where: { userId } })
    if (!account) throw new NotFoundError('Conta')

    if (Number(account.availableBalance) < input.amount) {
      throw new BadRequestError('Saldo insuficiente para realizar a transferência')
    }

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: account.id },
        data: { availableBalance: { decrement: input.amount } },
      })

      return tx.transaction.create({
        data: {
          accountId: account.id,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: input.amount,
          description: `Transferência para ${input.beneficiary}`,
          metadata: {
            beneficiary: input.beneficiary,
            ...(input.memo && { memo: input.memo }),
          },
        },
      })
    })

    return {
      transaction: this.serialize(transaction),
    }
  }

  async invest(userId: string, input: InvestmentInput) {
    const account = await prisma.account.findUnique({
      where: { userId },
      include: { rwaAssets: { where: { tokenSymbol: input.assetSymbol } } },
    })
    if (!account) throw new NotFoundError('Conta')

    if (Number(account.availableBalance) < input.amount) {
      throw new BadRequestError('Saldo insuficiente para realizar o investimento')
    }

    const assetInfo = this.getAssetInfo(input.assetSymbol)
    const tokensAcquired = input.amount / assetInfo.pricePerUnit

    const result = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: account.id },
        data: { availableBalance: { decrement: input.amount } },
      })

      let updatedAsset
      const existing = account.rwaAssets[0]

      if (existing) {
        updatedAsset = await tx.rWAAsset.update({
          where: { id: existing.id },
          data: { quantity: { increment: tokensAcquired } },
        })
      } else {
        updatedAsset = await tx.rWAAsset.create({
          data: {
            accountId: account.id,
            assetName: assetInfo.name,
            tokenSymbol: input.assetSymbol,
            quantity: tokensAcquired,
            pricePerUnit: assetInfo.pricePerUnit,
          },
        })
      }

      const newTransaction = await tx.transaction.create({
        data: {
          accountId: account.id,
          type: 'INVESTMENT',
          status: 'COMPLETED',
          amount: input.amount,
          description: `Investimento em ${assetInfo.name}`,
          metadata: {
            assetSymbol: input.assetSymbol,
            tokensAcquired,
            pricePerUnit: assetInfo.pricePerUnit,
          },
        },
      })

      return { transaction: newTransaction, updatedAsset }
    })

    return {
      transaction: this.serialize(result.transaction),
      updatedAsset: {
        id: result.updatedAsset.id,
        tokenSymbol: result.updatedAsset.tokenSymbol,
        assetName: result.updatedAsset.assetName,
        quantity: Number(result.updatedAsset.quantity),
        pricePerUnit: Number(result.updatedAsset.pricePerUnit),
        totalValue: Number(result.updatedAsset.quantity) * Number(result.updatedAsset.pricePerUnit),
      },
    }
  }

  async deposit(userId: string, input: DepositInput) {
    const account = await prisma.account.findUnique({ where: { userId } })
    if (!account) throw new NotFoundError('Conta')

    const description = input.description ?? (
      input.method === 'pix_cpf'
        ? `Depósito via PIX — CPF ${input.cpf}`
        : `Depósito via Cartão — ${(input as { cardHolder: string }).cardHolder}`
    )

    const metadata: Record<string, string> =
      input.method === 'pix_cpf'
        ? { method: 'pix_cpf', cpf: input.cpf }
        : {
            method: 'credit_card',
            cardHolder: (input as { cardHolder: string }).cardHolder,
            // Armazena apenas os últimos 4 dígitos — nunca o número completo
            cardLast4: (input as { cardNumber: string }).cardNumber.replace(/\D/g, '').slice(-4),
          }

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: account.id },
        data: { availableBalance: { increment: input.amount } },
      })

      return tx.transaction.create({
        data: {
          accountId: account.id,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: input.amount,
          description,
          metadata,
        },
      })
    })

    return { transaction: this.serialize(transaction) }
  }

  private getAssetInfo(symbol: string): { name: string; pricePerUnit: number } {
    const assets: Record<string, { name: string; pricePerUnit: number }> = {
      SOJA: { name: 'Soja Brasileira', pricePerUnit: 142.30 },
      MILHO: { name: 'Milho Safrinha', pricePerUnit: 72.80 },
    }
    return assets[symbol] ?? { name: symbol, pricePerUnit: 100 }
  }

  private serialize(tx: {
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
