import type { FastifyInstance } from 'fastify'
import { investmentSchema, transferSchema } from '@feeagro/shared'
import { OperationsService } from './operations.service.js'
import { BadRequestError } from '../../utils/api-error.js'

export async function operationsRoutes(app: FastifyInstance) {
  const service = new OperationsService()

  app.post('/transfer', { onRequest: [app.authenticate] }, async (request, reply) => {
    const result = transferSchema.safeParse(request.body)
    if (!result.success) {
      throw new BadRequestError('Dados inválidos', result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })))
    }

    const data = await service.transfer(request.user.sub, result.data)
    return reply.status(201).send(data)
  })

  app.post('/investment', { onRequest: [app.authenticate] }, async (request, reply) => {
    const result = investmentSchema.safeParse(request.body)
    if (!result.success) {
      throw new BadRequestError('Dados inválidos', result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })))
    }

    const data = await service.invest(request.user.sub, result.data)
    return reply.status(201).send(data)
  })
}
