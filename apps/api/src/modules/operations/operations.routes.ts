import type { FastifyInstance } from 'fastify'
import { depositSchema, investmentSchema, transferSchema } from '@feeagro/shared'
import { OperationsService } from './operations.service.js'
import { BadRequestError } from '../../utils/api-error.js'
import { withIdempotency } from '../../utils/idempotency.js'

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

    const idempotencyKey = request.headers['idempotency-key'] as string | undefined

    if (idempotencyKey) {
      const { result: data, cached } = await withIdempotency(
        idempotencyKey,
        request.user.sub,
        201,
        () => service.transfer(request.user.sub, result.data),
      )
      return reply.status(cached ? 200 : 201).send(data)
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

    const idempotencyKey = request.headers['idempotency-key'] as string | undefined

    if (idempotencyKey) {
      const { result: data, cached } = await withIdempotency(
        idempotencyKey,
        request.user.sub,
        201,
        () => service.invest(request.user.sub, result.data),
      )
      return reply.status(cached ? 200 : 201).send(data)
    }

    const data = await service.invest(request.user.sub, result.data)
    return reply.status(201).send(data)
  })

  app.post('/deposit', { onRequest: [app.authenticate] }, async (request, reply) => {
    const result = depositSchema.safeParse(request.body)
    if (!result.success) {
      throw new BadRequestError('Dados inválidos', result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })))
    }

    const idempotencyKey = request.headers['idempotency-key'] as string | undefined

    if (idempotencyKey) {
      const { result: data, cached } = await withIdempotency(
        idempotencyKey,
        request.user.sub,
        201,
        () => service.deposit(request.user.sub, result.data),
      )
      return reply.status(cached ? 200 : 201).send(data)
    }

    const data = await service.deposit(request.user.sub, result.data)
    return reply.status(201).send(data)
  })
}
