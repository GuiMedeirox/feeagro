import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SOJA_PRICE = 142.30
const MILHO_PRICE = 72.80

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.rWAAsset.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // User
  const passwordHash = await bcrypt.hash('123456', 10)
  const user = await prisma.user.create({
    data: {
      email: 'joao@feeagro.com',
      name: 'João Silva',
      passwordHash,
      kycStatus: 'VERIFIED',
    },
  })

  // Account
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      currency: 'BRL',
      availableBalance: 47832.50,
    },
  })

  // RWA Assets
  await prisma.rWAAsset.createMany({
    data: [
      {
        accountId: account.id,
        assetName: 'Soja Brasileira',
        tokenSymbol: 'SOJA',
        quantity: 150.5,
        pricePerUnit: SOJA_PRICE,
      },
      {
        accountId: account.id,
        assetName: 'Milho Safrinha',
        tokenSymbol: 'MILHO',
        quantity: 320.0,
        pricePerUnit: MILHO_PRICE,
      },
    ],
  })

  // Transactions (25 entries spread over last 60 days)
  const transactions = [
    // Deposits
    { days: 2, type: 'DEPOSIT', status: 'COMPLETED', amount: 15000, desc: 'Aporte via PIX - Banco do Brasil' },
    { days: 8, type: 'DEPOSIT', status: 'COMPLETED', amount: 8500, desc: 'Aporte via TED - Itaú' },
    { days: 15, type: 'DEPOSIT', status: 'COMPLETED', amount: 5000, desc: 'Aporte via PIX - Sicredi' },
    { days: 30, type: 'DEPOSIT', status: 'COMPLETED', amount: 20000, desc: 'Aporte inicial via TED' },
    { days: 45, type: 'DEPOSIT', status: 'COMPLETED', amount: 12000, desc: 'Aporte via PIX - Bradesco' },
    { days: 55, type: 'DEPOSIT', status: 'PENDING', amount: 3000, desc: 'Aporte via PIX - Nubank' },

    // Investments
    { days: 3, type: 'INVESTMENT', status: 'COMPLETED', amount: 7136.50, desc: 'Investimento em Soja Brasileira', meta: { assetSymbol: 'SOJA', tokensAcquired: 50.15, pricePerUnit: SOJA_PRICE } },
    { days: 10, type: 'INVESTMENT', status: 'COMPLETED', amount: 4547.20, desc: 'Investimento em Milho Safrinha', meta: { assetSymbol: 'MILHO', tokensAcquired: 62.46, pricePerUnit: MILHO_PRICE } },
    { days: 20, type: 'INVESTMENT', status: 'COMPLETED', amount: 14230, desc: 'Investimento em Soja Brasileira', meta: { assetSymbol: 'SOJA', tokensAcquired: 100, pricePerUnit: SOJA_PRICE } },
    { days: 25, type: 'INVESTMENT', status: 'COMPLETED', amount: 18928, desc: 'Investimento em Milho Safrinha', meta: { assetSymbol: 'MILHO', tokensAcquired: 260, pricePerUnit: MILHO_PRICE } },
    { days: 35, type: 'INVESTMENT', status: 'FAILED', amount: 5000, desc: 'Tentativa de investimento em Soja - falhou', meta: { assetSymbol: 'SOJA', error: 'Horário fora do pregão' } },
    { days: 40, type: 'INVESTMENT', status: 'COMPLETED', amount: 356.50, desc: 'Investimento em Soja Brasileira', meta: { assetSymbol: 'SOJA', tokensAcquired: 2.51, pricePerUnit: SOJA_PRICE } },

    // Transfers (OUT)
    { days: 5, type: 'TRANSFER', status: 'COMPLETED', amount: 1200, desc: 'Transferência para Maria Santos', meta: { beneficiary: 'Maria Santos', memo: 'Aluguel outubro' } },
    { days: 12, type: 'TRANSFER', status: 'COMPLETED', amount: 450, desc: 'Transferência para Carlos Oliveira', meta: { beneficiary: 'Carlos Oliveira' } },
    { days: 18, type: 'TRANSFER', status: 'COMPLETED', amount: 2800, desc: 'Transferência para Cooperativa Agro Sul', meta: { beneficiary: 'Cooperativa Agro Sul', memo: 'Insumos safra 24/25' } },
    { days: 28, type: 'TRANSFER', status: 'PENDING', amount: 750, desc: 'Transferência para Ana Lima', meta: { beneficiary: 'Ana Lima', memo: 'Consultoria' } },
    { days: 42, type: 'TRANSFER', status: 'COMPLETED', amount: 500, desc: 'Transferência para Pedro Costa', meta: { beneficiary: 'Pedro Costa' } },
    { days: 50, type: 'TRANSFER', status: 'FAILED', amount: 3000, desc: 'Transferência para Fazenda Boa Esperança - falhou', meta: { beneficiary: 'Fazenda Boa Esperança', error: 'Dados bancários inválidos' } },

    // Withdrawals
    { days: 7, type: 'WITHDRAWAL', status: 'COMPLETED', amount: 2000, desc: 'Saque para conta corrente Banco do Brasil' },
    { days: 22, type: 'WITHDRAWAL', status: 'COMPLETED', amount: 5000, desc: 'Saque para conta corrente Itaú' },
    { days: 33, type: 'WITHDRAWAL', status: 'COMPLETED', amount: 800, desc: 'Saque para conta corrente Bradesco' },
    { days: 48, type: 'WITHDRAWAL', status: 'PENDING', amount: 1500, desc: 'Saque para conta corrente Sicredi' },
    { days: 58, type: 'WITHDRAWAL', status: 'COMPLETED', amount: 3500, desc: 'Saque para conta corrente Santander' },

    // More recent
    { days: 1, type: 'DEPOSIT', status: 'COMPLETED', amount: 600, desc: 'Rendimento portfolio RWA - Soja' },
    { days: 4, type: 'DEPOSIT', status: 'COMPLETED', amount: 340, desc: 'Rendimento portfolio RWA - Milho' },
  ]

  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        type: t.type as 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'TRANSFER',
        status: t.status as 'PENDING' | 'COMPLETED' | 'FAILED',
        amount: t.amount,
        description: t.desc,
        metadata: t.meta ?? null,
        createdAt: daysAgo(t.days),
      },
    })
  }

  console.log('✅ Seed concluído!')
  console.log('📧 Login: joao@feeagro.com')
  console.log('🔑 Senha: 123456')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
