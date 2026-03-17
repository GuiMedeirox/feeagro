import cors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'
import { env } from '../config/env.js'

export async function registerCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: env.NODE_ENV === 'production' ? false : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
}
