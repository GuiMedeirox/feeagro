import type { FastifyInstance } from 'fastify'
import { loginSchema, refreshTokenSchema, registerSchema } from '@feeagro/shared'
import { AuthService } from './auth.service.js'
import { BadRequestError } from '../../utils/api-error.js'

export async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app)

  app.post('/register', async (request, reply) => {
    const result = registerSchema.safeParse(request.body)
    if (!result.success) {
      throw new BadRequestError('Dados inválidos', result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })))
    }

    const data = await service.register(result.data)
    return reply.status(201).send(data)
  })

  app.post('/login', async (request, reply) => {
    const result = loginSchema.safeParse(request.body)
    if (!result.success) {
      throw new BadRequestError('Dados inválidos', result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })))
    }

    const data = await service.login(result.data)
    return reply.send(data)
  })

  app.post('/refresh', async (request, reply) => {
    const result = refreshTokenSchema.safeParse(request.body)
    if (!result.success) {
      throw new BadRequestError('refreshToken é obrigatório')
    }

    const data = await service.refresh(result.data.refreshToken)
    return reply.send(data)
  })

  app.post('/logout', { onRequest: [app.authenticate] }, async (request, reply) => {
    const result = refreshTokenSchema.safeParse(request.body)
    if (result.success) {
      await service.logout(result.data.refreshToken)
    }
    return reply.status(204).send()
  })

  app.get('/me', { onRequest: [app.authenticate] }, async (request, reply) => {
    const user = await service.getMe(request.user.sub)
    return reply.send({ user })
  })
}
