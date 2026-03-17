import { OperationForm } from '@/components/operations/operation-form'

export default function NewOperationPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <p className="text-sm text-muted">Simule uma transferência ou invista em ativos reais do agronegócio.</p>
      </div>
      <OperationForm />
    </div>
  )
}
