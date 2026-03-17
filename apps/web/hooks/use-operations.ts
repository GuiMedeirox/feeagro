'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { TransferInput, InvestmentInput, Transaction } from '@feeagro/shared'

interface OperationResult {
  transaction: Transaction
}

export function useCreateTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TransferInput) => {
      const res = await apiClient.post<OperationResult>('/operations/transfer', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useCreateInvestment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: InvestmentInput) => {
      const res = await apiClient.post<OperationResult>('/operations/investment', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
