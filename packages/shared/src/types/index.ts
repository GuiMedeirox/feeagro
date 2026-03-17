import { KycStatus, TransactionStatus, TransactionType } from '../enums'

export interface User {
  id: string
  email: string
  name: string
  kycStatus: KycStatus
  createdAt: string
}

export interface Account {
  id: string
  userId: string
  currency: string
  availableBalance: number
}

export interface RWAAsset {
  id: string
  accountId: string
  assetName: string
  tokenSymbol: string
  quantity: number
  pricePerUnit: number
  totalValue: number
}

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface DashboardSummary {
  account: Account
  rwaAssets: RWAAsset[]
  kycStatus: KycStatus
  recentTransactions: Transaction[]
  totalPortfolioValue: number
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
  details?: { field: string; message: string }[]
}

export interface AuthResponse {
  user: User
  accessToken: string
}
