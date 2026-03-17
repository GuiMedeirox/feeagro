'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  CreditCard,
  Smartphone,
  ArrowRight,
  Edit3,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react'
import { depositSchema, type DepositInput } from '@feeagro/shared'
import { useCreateDeposit } from '@/hooks/use-operations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

type DepositMethod = 'pix_cpf' | 'credit_card'
type Step = 'method' | 'form' | 'confirm' | 'success'

function formatCPF(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string) {
  return value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')
}

// ─── Step 1: Method selector ─────────────────────────────────────────────────

function MethodSelector({ onSelect }: { onSelect: (m: DepositMethod) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted mb-2">Como você quer depositar?</p>

      <button
        onClick={() => onSelect('pix_cpf')}
        className="flex items-center gap-4 p-5 bg-brand-800 border border-brand-700 hover:border-brand-400 rounded-2xl transition-all group text-left"
      >
        <div className="size-12 rounded-xl bg-brand-400/10 border border-brand-400/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-400/20 transition-colors">
          <Smartphone className="size-6 text-brand-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-cream-100">PIX via CPF</p>
          <p className="text-sm text-muted mt-0.5">Instântaneo, disponível 24h</p>
        </div>
        <ArrowRight className="size-5 text-muted group-hover:text-brand-300 transition-colors flex-shrink-0" />
      </button>

      <button
        onClick={() => onSelect('credit_card')}
        className="flex items-center gap-4 p-5 bg-brand-800 border border-brand-700 hover:border-brand-400 rounded-2xl transition-all group text-left"
      >
        <div className="size-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
          <CreditCard className="size-6 text-gold-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-cream-100">Cartão de Crédito</p>
          <p className="text-sm text-muted mt-0.5">Visa, Mastercard, Elo</p>
        </div>
        <ArrowRight className="size-5 text-muted group-hover:text-gold-400 transition-colors flex-shrink-0" />
      </button>
    </div>
  )
}

// ─── Step 2: Forms ────────────────────────────────────────────────────────────

function PixForm({ onConfirm, defaultValues }: { onConfirm: (data: DepositInput) => void; defaultValues?: Extract<DepositInput, { method: 'pix_cpf' }> }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Extract<DepositInput, { method: 'pix_cpf' }>>({
    resolver: zodResolver(depositSchema),
    defaultValues: defaultValues ?? { method: 'pix_cpf' },
  })

  return (
    <form onSubmit={handleSubmit(onConfirm)} className="flex flex-col gap-4">
      <input type="hidden" {...register('method')} value="pix_cpf" />
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
        label="CPF"
        placeholder="000.000.000-00"
        maxLength={14}
        hint="Chave PIX do pagador"
        error={errors.cpf?.message}
        {...register('cpf')}
        onChange={(e) => setValue('cpf', formatCPF(e.target.value))}
      />
      <Button type="submit" size="lg" className="mt-2 w-full">
        Revisar <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}

function CardForm({ onConfirm, defaultValues }: { onConfirm: (data: DepositInput) => void; defaultValues?: Extract<DepositInput, { method: 'credit_card' }> }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Extract<DepositInput, { method: 'credit_card' }>>({
    resolver: zodResolver(depositSchema),
    defaultValues: defaultValues ?? { method: 'credit_card' },
  })

  const e = errors as Record<string, { message?: string }>

  return (
    <form onSubmit={handleSubmit(onConfirm)} className="flex flex-col gap-4">
      <input type="hidden" {...register('method')} value="credit_card" />
      <Input
        label="Valor (R$)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0,00"
        error={e.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />
      <Input
        label="Número do cartão"
        placeholder="0000 0000 0000 0000"
        maxLength={19}
        error={e.cardNumber?.message}
        {...register('cardNumber')}
        onChange={(e) => setValue('cardNumber', formatCardNumber(e.target.value))}
      />
      <Input
        label="Nome no cartão"
        placeholder="JOÃO SILVA"
        error={e.cardHolder?.message}
        {...register('cardHolder')}
        onChange={(e) => setValue('cardHolder', e.target.value.toUpperCase())}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Validade"
          placeholder="MM/AA"
          maxLength={5}
          error={e.expiry?.message}
          {...register('expiry')}
          onChange={(e) => setValue('expiry', formatExpiry(e.target.value))}
        />
        <Input
          label="CVV"
          placeholder="000"
          maxLength={4}
          type="password"
          error={e.cvv?.message}
          {...register('cvv')}
        />
      </div>
      <Button type="submit" size="lg" className="mt-2 w-full">
        Revisar <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}

// ─── Step 3: Confirmation ─────────────────────────────────────────────────────

function ConfirmationScreen({
  data,
  onConfirm,
  onEdit,
  isLoading,
}: {
  data: DepositInput
  onConfirm: () => void
  onEdit: () => void
  isLoading: boolean
}) {
  const isPix = data.method === 'pix_cpf'
  const d = data as Record<string, unknown>

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center py-4">
        <div className="flex justify-center mb-3">
          <div className={cn(
            'size-14 rounded-2xl flex items-center justify-center',
            isPix ? 'bg-brand-400/10 border border-brand-400/30' : 'bg-gold-500/10 border border-gold-500/30'
          )}>
            {isPix
              ? <Smartphone className="size-7 text-brand-300" />
              : <CreditCard className="size-7 text-gold-400" />
            }
          </div>
        </div>
        <p className="text-sm text-muted mb-1">{isPix ? 'Depósito via PIX' : 'Depósito via Cartão'}</p>
        <p className="font-display text-4xl font-bold text-cream-100 tabular-nums">
          {formatCurrency(d.amount as number)}
        </p>
      </div>

      <div className="p-4 bg-brand-900/50 rounded-xl border border-brand-700 flex flex-col gap-0">
        {isPix && <ConfirmRow label="CPF / Chave PIX" value={d.cpf as string} />}
        {!isPix && (
          <>
            <ConfirmRow label="Cartão" value={`•••• •••• •••• ${(d.cardNumber as string).replace(/\s/g, '').slice(-4)}`} />
            <ConfirmRow label="Titular" value={d.cardHolder as string} />
            <ConfirmRow label="Validade" value={d.expiry as string} />
          </>
        )}
        <ConfirmRow label="Método" value={isPix ? 'PIX instantâneo' : 'Crédito'} />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onEdit} className="flex-1">
          <Edit3 className="size-4" /> Editar
        </Button>
        <Button onClick={onConfirm} loading={isLoading} className="flex-1">
          Confirmar depósito
        </Button>
      </div>
    </div>
  )
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-brand-700/50 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm text-cream-100 font-medium">{value}</span>
    </div>
  )
}

// ─── Step 4: Success ──────────────────────────────────────────────────────────

function SuccessScreen({ amount, onNew, onDashboard }: { amount: number; onNew: () => void; onDashboard: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="size-20 rounded-full bg-brand-400/10 border border-brand-400/30 flex items-center justify-center animate-in zoom-in-50 duration-500">
        <CheckCircle2 className="size-10 text-brand-300" />
      </div>
      <div>
        <p className="font-display text-xl font-bold text-cream-100">Depósito realizado!</p>
        <p className="text-brand-300 font-semibold tabular-nums mt-1">{formatCurrency(amount)}</p>
        <p className="text-sm text-muted mt-2">Seu saldo foi atualizado.</p>
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="secondary" onClick={onNew} className="flex-1">Novo depósito</Button>
        <Button onClick={onDashboard} className="flex-1">Ver dashboard</Button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const STEPS: Step[] = ['method', 'form', 'confirm', 'success']
const stepLabels: Partial<Record<Step, string>> = {
  form: 'Dados',
  confirm: 'Confirmação',
}

export function DepositForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<DepositMethod | null>(null)
  const [formData, setFormData] = useState<DepositInput | null>(null)
  const [idempotencyKey, setIdempotencyKey] = useState('')
  const depositMutation = useCreateDeposit()

  const handleMethodSelect = (m: DepositMethod) => {
    setMethod(m)
    setStep('form')
  }

  // Gera uma chave nova a cada vez que o usuário avança para confirmação.
  // Cliques repetidos em "Confirmar" reutilizam a mesma chave — sem cobrança dupla.
  // "Editar" + reenvio do form gera nova chave, pois os dados podem ter mudado.
  const handleFormConfirm = (data: DepositInput) => {
    setFormData(data)
    setIdempotencyKey(crypto.randomUUID())
    setStep('confirm')
  }

  const handleConfirm = async () => {
    if (!formData) return
    try {
      await depositMutation.mutateAsync({ data: formData, idempotencyKey })
      toast.success('Depósito realizado com sucesso!')
      setStep('success')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao processar depósito.'
      toast.error(message)
    }
  }

  const handleNew = () => {
    setStep('method')
    setMethod(null)
    setFormData(null)
    setIdempotencyKey('')
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Back button */}
      {step !== 'success' && (
        <button
          onClick={() => {
            if (step === 'method') router.back()
            else if (step === 'form') setStep('method')
            else if (step === 'confirm') setStep('form')
          }}
          className="flex items-center gap-2 text-sm text-muted hover:text-cream-100 transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>
      )}

      {/* Step indicator (só nas etapas form/confirm) */}
      {(step === 'form' || step === 'confirm') && (
        <div className="flex items-center gap-2 mb-6">
          {(['form', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                step === s ? 'bg-brand-400 text-brand-950'
                : step === 'confirm' && s === 'form' ? 'bg-brand-400/30 text-brand-300'
                : 'bg-brand-800 text-muted'
              )}>
                {i + 1}
              </div>
              <span className={`text-xs ${step === s ? 'text-cream-100' : 'text-muted'}`}>
                {stepLabels[s]}
              </span>
              {i === 0 && <div className="h-px bg-brand-700 w-8" />}
            </div>
          ))}
        </div>
      )}

      {step === 'method' && <MethodSelector onSelect={handleMethodSelect} />}

      {step === 'form' && method === 'pix_cpf' && (
        <PixForm
          onConfirm={handleFormConfirm}
          defaultValues={formData?.method === 'pix_cpf' ? formData : undefined}
        />
      )}
      {step === 'form' && method === 'credit_card' && (
        <CardForm
          onConfirm={handleFormConfirm}
          defaultValues={formData?.method === 'credit_card' ? formData : undefined}
        />
      )}

      {step === 'confirm' && formData && (
        <ConfirmationScreen
          data={formData}
          onConfirm={handleConfirm}
          onEdit={() => setStep('form')}
          isLoading={depositMutation.isPending}
        />
      )}

      {step === 'success' && formData && (
        <SuccessScreen
          amount={formData.amount}
          onNew={handleNew}
          onDashboard={() => router.push('/dashboard')}
        />
      )}
    </div>
  )
}
