'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { loginSchema, type LoginInput } from '@feeagro/shared'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password)
      router.push('/dashboard')
    } catch {
      toast.error('Credenciais inválidas. Verifique seu email e senha.')
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-cream-100 mb-1">Entrar</h2>
      <p className="text-sm text-muted mb-8">
        Acesse sua conta FeeAgro
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="joao@feeagro.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-8 text-muted hover:text-cream-100 transition-colors"
            aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <Button type="submit" loading={isSubmitting} size="lg" className="mt-2 w-full">
          Entrar
        </Button>
      </form>

      <div className="mt-4 p-3 rounded-xl bg-brand-800 border border-brand-700">
        <p className="text-xs text-muted text-center">
          Demo: <span className="text-brand-300">joao@feeagro.com</span> / <span className="text-brand-300">123456</span>
        </p>
      </div>

      <p className="text-sm text-muted text-center mt-6">
        Não tem conta?{' '}
        <Link href="/register" className="text-brand-300 hover:text-brand-200 transition-colors">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}
