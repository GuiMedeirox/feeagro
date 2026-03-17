import { randomBytes } from 'crypto'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../../config/database.js'
import { env } from '../../config/env.js'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../utils/api-error.js'
import { hashPassword, verifyPassword } from '../../utils/password.js'
import type { LoginInput, RegisterInput } from '@feeagro/shared'

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing) throw new ConflictError('Email já cadastrado')

    const passwordHash = await hashPassword(input.password)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash,
          kycStatus: 'PENDING',
        },
      })

      await tx.account.create({
        data: {
          userId: newUser.id,
          currency: 'BRL',
          availableBalance: 0,
        },
      })

      return newUser
    })

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email)

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user) throw new UnauthorizedError('Credenciais inválidas')

    const valid = await verifyPassword(input.password, user.passwordHash)
    if (!valid) throw new UnauthorizedError('Credenciais inválidas')

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email)

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } })

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } })
      throw new UnauthorizedError('Refresh token inválido ou expirado')
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } })
    if (!user) throw new NotFoundError('Usuário')

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: stored.id } })
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email)

    return { accessToken, refreshToken }
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } })
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundError('Usuário')
    return this.sanitizeUser(user)
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.app.jwt.sign({ sub: userId, email })

    const refreshToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_EXPIRES_DAYS)

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    })

    return { accessToken, refreshToken }
  }

  private sanitizeUser(user: { id: string; email: string; name: string; kycStatus: string; createdAt: Date }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      kycStatus: user.kycStatus,
      createdAt: user.createdAt.toISOString(),
    }
  }
}
