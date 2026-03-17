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

const amountField = z
  .number({ invalid_type_error: 'Valor deve ser um número' })
  .positive('Valor deve ser positivo')
  .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais')

export const depositSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('pix_cpf'),
    amount: amountField,
    cpf: z
      .string()
      .min(11, 'CPF inválido')
      .max(14, 'CPF inválido')
      .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
    description: z.string().max(200).optional(),
  }),
  z.object({
    method: z.literal('credit_card'),
    amount: amountField,
    cardNumber: z
      .string()
      .min(16, 'Número inválido')
      .max(19, 'Número inválido')
      .regex(/^[\d\s]{16,19}$/, 'Número do cartão inválido'),
    cardHolder: z.string().min(3, 'Nome do titular é obrigatório'),
    expiry: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use o formato MM/AA'),
    cvv: z
      .string()
      .regex(/^\d{3,4}$/, 'CVV inválido'),
    description: z.string().max(200).optional(),
  }),
])

export type TransferInput = z.infer<typeof transferSchema>
export type InvestmentInput = z.infer<typeof investmentSchema>
export type DepositInput = z.infer<typeof depositSchema>
