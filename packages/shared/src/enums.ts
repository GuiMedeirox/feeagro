export const KycStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const

export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus]

export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  INVESTMENT: 'INVESTMENT',
  TRANSFER: 'TRANSFER',
} as const

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]

export const RWASymbol = {
  SOJA: 'SOJA',
  MILHO: 'MILHO',
} as const

export type RWASymbol = (typeof RWASymbol)[keyof typeof RWASymbol]
