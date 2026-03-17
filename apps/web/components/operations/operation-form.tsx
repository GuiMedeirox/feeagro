'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowRight, CheckCircle2, Edit3, ArrowLeftRight, TrendingUp } from 'lucide-react'
import { transferSchema, investmentSchema, type TransferInput, type InvestmentInput } from '@feeagro/shared'
import { useCreateTransfer, useCreateInvestment } from '@/hooks/use-operations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

type OperationType = 'transfer' | 'investment'
type Step = 'form' | 'confirm' | 'success'

// ─── Transfer Form ──────────────────────────────────────────────────────────

function TransferForm({ onConfirm }: { onConfirm: (data: TransferInput) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TransferInput>({
    resolver: zodResolver(transferSchema),
  })
  return (
    <form onSubmit={handleSubmit(onConfirm)} className="flex flex-col gap-4">
      <Input
        label="Beneficiário"
        placeholder="Nome ou chave PIX"
        error={errors.beneficiary?.message}
        {...register('beneficiary')}
      />
      <Input
        label="Valor (R$)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0,00"
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />
      <Input
        label="Memo (opcional)"
        placeholder="Descrição da transferência"
        error={errors.memo?.message}
        {...register('memo')}
      />
      <Button type="submit" size="lg" className="mt-2 w-full">
        Revisar <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}

// ─── Investment Form ─────────────────────────────────────────────────────────

const ASSET_OPTIONS = [
  { value: 'SOJA', label: '🌱 Soja Brasileira', price: 142.30 },
  { value: 'MILHO', label: '🌽 Milho Safrinha', price: 72.80 },
]

function InvestmentForm({ onConfirm }: { onConfirm: (data: InvestmentInput) => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<InvestmentInput>({
    resolver: zodResolver(investmentSchema),
  })
  const amount = watch('amount')
  const symbol = watch('assetSymbol')
  const asset = ASSET_OPTIONS.find(a => a.value === symbol)
  const tokens = asset && amount ? amount / asset.price : null

  return (
    <form onSubmit={handleSubmit(onConfirm)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-cream-200">Ativo</label>
        <select
          className="w-full bg-brand-900 border border-brand-600 rounded-lg px-3 py-2 text-sm text-cream-100 outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
          style={{ background: '#0c1a10' }}
          {...register('assetSymbol')}
          defaultValue=""
        >
          <option value="" disabled>Selecione um ativo</option>
          {ASSET_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} style={{ background: '#0c1a10' }}>
              {opt.label} — R$ {opt.price.toFixed(2)}/token
            </option>
          ))}
        </select>
        {errors.assetSymbol && <p className="text-xs text-danger">{errors.assetSymbol.message}</p>}
      </div>

      <Input
        label="Valor a investir (R$)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0,00"
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />

      {tokens !== null && (
        <div className="p-3 rounded-xl bg-brand-700/40 border border-brand-600 text-sm">
          <p className="text-muted text-xs mb-1">Estimativa de tokens</p>
          <p className="text-gold-400 font-semibold font-mono">
            {tokens.toFixed(4)} {symbol}
          </p>
        </div>
      )}

      <Button type="submit" size="lg" className="mt-2 w-full">
        Revisar <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}

// ─── Confirmation ─────────────────────────────────────────────────────────────

function ConfirmationScreen({
  type,
  data,
  onConfirm,
  onEdit,
  isLoading,
}: {
  type: OperationType
  data: TransferInput | InvestmentInput
  onConfirm: () => void
  onEdit: () => void
  isLoading: boolean
}) {
  const isTransfer = type === 'transfer'
  const d = data as Record<string, unknown>

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center py-4">
        <p className="text-sm text-muted mb-2">{isTransfer ? 'Transferência de' : 'Investimento de'}</p>
        <p className="font-display text-4xl font-bold text-cream-100 tabular-nums">
          {formatCurrency(d.amount as number)}
        </p>
      </div>

      <div className="p-4 bg-brand-900/50 rounded-xl border border-brand-700 flex flex-col gap-3">
        {isTransfer ? (
          <>
            <ConfirmRow label="Para" value={d.beneficiary as string} />
            {d.memo && <ConfirmRow label="Memo" value={d.memo as string} />}
          </>
        ) : (
          <>
            <ConfirmRow label="Ativo" value={d.assetSymbol as string} />
            {d.assetSymbol === 'SOJA' && (
              <ConfirmRow label="Tokens estimados" value={`${((d.amount as number) / 142.3).toFixed(4)} SOJA`} />
            )}
            {d.assetSymbol === 'MILHO' && (
              <ConfirmRow label="Tokens estimados" value={`${((d.amount as number) / 72.8).toFixed(4)} MILHO`} />
            )}
          </>
        )}
        <ConfirmRow label="Tipo" value={isTransfer ? 'Transferência PIX' : 'Investimento RWA'} />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onEdit} className="flex-1">
          <Edit3 className="size-4" />
          Editar
        </Button>
        <Button onClick={onConfirm} loading={isLoading} className="flex-1">
          Confirmar
        </Button>
      </div>
    </div>
  )
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-brand-700/50 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm text-cream-100 font-medium">{value}</span>
    </div>
  )
}

// ─── Success ─────────────────────────────────────────────────────────────────

function SuccessScreen({ onNewOperation, onGoToTransactions }: { onNewOperation: () => void; onGoToTransactions: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="size-20 rounded-full bg-brand-400/10 border border-brand-400/30 flex items-center justify-center animate-in zoom-in-50 duration-500">
        <CheckCircle2 className="size-10 text-brand-300" />
      </div>
      <div>
        <p className="font-display text-xl font-bold text-cream-100">Operação realizada!</p>
        <p className="text-sm text-muted mt-2">Sua operação foi processada com sucesso.</p>
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="secondary" onClick={onNewOperation} className="flex-1">
          Nova operação
        </Button>
        <Button onClick={onGoToTransactions} className="flex-1">
          Ver transações
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function OperationForm() {
  const router = useRouter()
  const [type, setType] = useState<OperationType>('transfer')
  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<TransferInput | InvestmentInput | null>(null)

  const transferMutation = useCreateTransfer()
  const investmentMutation = useCreateInvestment()
  const isLoading = transferMutation.isPending || investmentMutation.isPending

  const handleFormConfirm = (data: TransferInput | InvestmentInput) => {
    setFormData(data)
    setStep('confirm')
  }

  const handleConfirm = async () => {
    if (!formData) return
    try {
      if (type === 'transfer') {
        await transferMutation.mutateAsync(formData as TransferInput)
      } else {
        await investmentMutation.mutateAsync(formData as InvestmentInput)
      }
      toast.success('Operação realizada com sucesso!')
      setStep('success')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao processar operação.'
      toast.error(message)
    }
  }

  const handleNewOperation = () => {
    setStep('form')
    setFormData(null)
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Type selector */}
      {step === 'form' && (
        <div className="flex gap-2 mb-6 p-1 bg-brand-800 rounded-xl border border-brand-700">
          <button
            onClick={() => setType('transfer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              type === 'transfer'
                ? 'bg-brand-400/20 text-brand-300 border border-brand-400/40'
                : 'text-muted hover:text-cream-200'
            }`}
          >
            <ArrowLeftRight className="size-4" />
            Transferência
          </button>
          <button
            onClick={() => setType('investment')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              type === 'investment'
                ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
                : 'text-muted hover:text-cream-200'
            }`}
          >
            <TrendingUp className="size-4" />
            Investimento
          </button>
        </div>
      )}

      {/* Step indicator */}
      {step !== 'success' && (
        <div className="flex items-center gap-2 mb-6">
          {(['form', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-brand-400 text-brand-950'
                    : step === 'confirm' && s === 'form'
                    ? 'bg-brand-400/30 text-brand-300'
                    : 'bg-brand-800 text-muted'
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-xs ${step === s ? 'text-cream-100' : 'text-muted'}`}>
                {s === 'form' ? 'Dados' : 'Confirmação'}
              </span>
              {i === 0 && <div className="flex-1 h-px bg-brand-700 w-8" />}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {step === 'form' && (
        type === 'transfer'
          ? <TransferForm onConfirm={handleFormConfirm} />
          : <InvestmentForm onConfirm={handleFormConfirm} />
      )}

      {step === 'confirm' && formData && (
        <ConfirmationScreen
          type={type}
          data={formData}
          onConfirm={handleConfirm}
          onEdit={() => setStep('form')}
          isLoading={isLoading}
        />
      )}

      {step === 'success' && (
        <SuccessScreen
          onNewOperation={handleNewOperation}
          onGoToTransactions={() => router.push('/transactions')}
        />
      )}
    </div>
  )
}
