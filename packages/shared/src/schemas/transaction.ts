import { z } from 'zod'
import { TransactionStatus, TransactionType } from '../enums'

export const transactionFiltersSchema = z.object({
  type: z.nativeEnum(TransactionType).optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'amount']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
})

export type TransactionFilters = z.infer<typeof transactionFiltersSchema>
