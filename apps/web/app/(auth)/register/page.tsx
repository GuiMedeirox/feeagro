'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { registerSchema, type RegisterInput } from '@feeagro/shared'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser(data.name, data.email, data.password)
      toast.success('Conta criada com sucesso!')
      router.push('/dashboard')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao criar conta.'
      toast.error(message)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-cream-100 mb-1">Criar conta</h2>
      <p className="text-sm text-muted mb-8">
        Comece a investir no agronegócio brasileiro
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nome completo"
          placeholder="João Silva"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="joao@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mín. 6 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-8 text-muted hover:text-cream-100 transition-colors"
            aria-label="Toggle password"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <Button type="submit" loading={isSubmitting} size="lg" className="mt-2 w-full">
          Criar conta
        </Button>
      </form>

      <p className="text-sm text-muted text-center mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="text-brand-300 hover:text-brand-200 transition-colors">
          Entrar
        </Link>
      </p>
    </div>
  )
}
