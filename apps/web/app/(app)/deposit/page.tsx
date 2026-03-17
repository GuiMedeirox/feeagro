import { DepositForm } from '@/components/operations/deposit-form'

export default function DepositPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <p className="text-sm text-muted">Adicione saldo à sua conta via PIX ou cartão de crédito.</p>
      </div>
      <DepositForm />
    </div>
  )
}
