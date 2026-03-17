import { z } from 'zod'
import { RWASymbol } from '../enums'

export const transferSchema = z.object({
  beneficiary: z.string().min(2, 'Beneficiário é obrigatório'),
  amount: z
    .number({ invalid_type_error: 'Valor deve ser um número' })
    .positive('Valor deve ser positivo')
    .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
  memo: z.string().max(200, 'Memo deve ter no máximo 200 caracteres').optional(),
})

export const investmentSchema = z.object({
  assetSymbol: z.nativeEnum(RWASymbol, { errorMap: () => ({ message: 'Ativo inválido' }) }),
  amount: z
    .number({ invalid_type_error: 'Valor deve ser um número' })
    .positive('Valor deve ser positivo')
    .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
})

export type TransferInput = z.infer<typeof transferSchema>
export type InvestmentInput = z.infer<typeof investmentSchema>
