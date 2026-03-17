'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { TransferInput, InvestmentInput, DepositInput, Transaction } from '@feeagro/shared'

interface OperationResult {
  transaction: Transaction
}

interface WithKey<T> {
  data: T
  idempotencyKey: string
}

function idempotencyHeaders(key: string) {
  return { 'Idempotency-Key': key }
}

export function useCreateTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data, idempotencyKey }: WithKey<TransferInput>) => {
      const res = await apiClient.post<OperationResult>('/operations/transfer', data, {
        headers: idempotencyHeaders(idempotencyKey),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useCreateDeposit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data, idempotencyKey }: WithKey<DepositInput>) => {
      const res = await apiClient.post<OperationResult>('/operations/deposit', data, {
        headers: idempotencyHeaders(idempotencyKey),
      })
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
    mutationFn: async ({ data, idempotencyKey }: WithKey<InvestmentInput>) => {
      const res = await apiClient.post<OperationResult>('/operations/investment', data, {
        headers: idempotencyHeaders(idempotencyKey),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
