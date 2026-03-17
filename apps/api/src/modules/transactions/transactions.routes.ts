import type { FastifyInstance } from 'fastify'
import { transactionFiltersSchema } from '@feeagro/shared'
import { TransactionsService } from './transactions.service.js'
import { BadRequestError } from '../../utils/api-error.js'

export async function transactionsRoutes(app: FastifyInstance) {
  const service = new TransactionsService()

  app.get('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const result = transactionFiltersSchema.safeParse(request.query)
    if (!result.success) {
      throw new BadRequestError('Filtros inválidos', result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })))
    }

    const data = await service.list(request.user.sub, result.data)
    return reply.send(data)
  })

  app.get('/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const transaction = await service.getById(request.user.sub, id)
    return reply.send({ transaction })
  })
}
