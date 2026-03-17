import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../config/env.js'
import { UnauthorizedError } from '../utils/api-error.js'

export async function registerJwt(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  })

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch {
        throw new UnauthorizedError('Token inválido ou expirado')
      }
    }
  )
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email: string }
    user: { sub: string; email: string }
  }
}
