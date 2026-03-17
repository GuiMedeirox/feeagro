import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { KycStatus } from '@feeagro/shared'

const kycConfig = {
  VERIFIED: {
    icon: ShieldCheck,
    label: 'Verificado',
    description: 'Sua identidade foi confirmada com sucesso.',
    color: 'text-brand-300',
    bg: 'bg-brand-400/10',
    border: 'border-brand-400/30',
  },
  PENDING: {
    icon: Clock,
    label: 'Pendente',
    description: 'Aguardando verificação de identidade.',
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/30',
  },
  REJECTED: {
    icon: ShieldAlert,
    label: 'Reprovado',
    description: 'Verificação não aprovada. Entre em contato.',
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/30',
  },
}

interface KycStatusCardProps {
  status: KycStatus
}

export function KycStatusCard({ status }: KycStatusCardProps) {
  const config = kycConfig[status]
  const Icon = config.icon

  return (
    <Card>
      <CardContent>
        <p className="text-xs text-muted font-medium mb-3 uppercase tracking-widest">Status KYC</p>
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${config.bg} ${config.border}`}>
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <Icon className={`size-5 ${config.color}`} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${config.color}`}>{config.label}</p>
            <p className="text-xs text-muted mt-0.5">{config.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
