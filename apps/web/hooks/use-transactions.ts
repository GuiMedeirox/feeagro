'use client'

import { useQuery } from '@tanstack/react-query'
import { keepPreviousData } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Transaction, PaginatedResponse, TransactionFilters } from '@feeagro/shared'

export function useTransactions(filters: Partial<TransactionFilters>) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Transaction>>('/transactions', {
        params: filters,
      })
      return data
    },
    placeholderData: keepPreviousData,
  })
}

export function useTransaction(id: string | null) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ transaction: Transaction }>(`/transactions/${id}`)
      return data.transaction
    },
    enabled: !!id,
  })
}
