import { Wheat } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-brand-900 relative overflow-hidden items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950" />
        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 size-64 rounded-full bg-brand-400/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 size-96 rounded-full bg-gold-500/5 blur-3xl" />

        <div className="relative z-10 text-center px-12">
          <div className="flex justify-center mb-8">
            <div className="size-20 rounded-3xl bg-brand-400/10 border border-brand-400/30 flex items-center justify-center">
              <Wheat className="size-10 text-brand-300" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-cream-100 mb-4">
            fee<span className="text-brand-300">Agro</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-sm">
            Invista no agronegócio brasileiro com segurança e transparência.
          </p>
          <div className="mt-12 flex flex-col gap-3">
            {['Ativos Reais Tokenizados', 'Soja & Milho Safra 2025/26', 'KYC Verificado'].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-brand-800/50 border border-brand-700 rounded-xl px-4 py-3 text-left"
                >
                  <div className="size-2 rounded-full bg-brand-400 flex-shrink-0" />
                  <span className="text-sm text-cream-200">{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-6 py-12 bg-brand-950">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Wheat className="size-6 text-brand-300" />
            <span className="font-display font-bold text-xl text-cream-100">
              fee<span className="text-brand-300">Agro</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
