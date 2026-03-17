import type { Metadata } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'FeeAgro — Agro Finance',
  description: 'Plataforma de investimento em ativos reais do agronegócio brasileiro',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
        <Providers>{children}</Providers>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#1a3020',
              border: '1px solid #2d6a4f',
              color: '#f5e6c8',
            },
          }}
        />
      </body>
    </html>
  )
}
