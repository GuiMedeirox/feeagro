import type { Prisma } from '@prisma/client'
import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/api-error.js'
import type { TransactionFilters } from '@feeagro/shared'

export class TransactionsService {
  async list(userId: string, filters: TransactionFilters) {
    const account = await prisma.account.findUnique({ where: { userId } })
    if (!account) throw new NotFoundError('Conta')

    const where: Prisma.TransactionWhereInput = {
      accountId: account.id,
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        description: { contains: filters.search, mode: 'insensitive' },
      }),
    }

    const [total, transactions] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { [filters.sortBy]: filters.sortOrder },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
    ])

    return {
      data: transactions.map(this.serialize),
      meta: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    }
  }

  async getById(userId: string, transactionId: string) {
    const account = await prisma.account.findUnique({ where: { userId } })
    if (!account) throw new NotFoundError('Conta')

    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, accountId: account.id },
    })

    if (!transaction) throw new NotFoundError('Transação')

    return this.serialize(transaction)
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
