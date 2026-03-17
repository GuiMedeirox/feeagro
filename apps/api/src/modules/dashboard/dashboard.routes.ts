import type { FastifyInstance } from 'fastify'
import { DashboardService } from './dashboard.service.js'

export async function dashboardRoutes(app: FastifyInstance) {
  const service = new DashboardService()

  app.get('/summary', { onRequest: [app.authenticate] }, async (request, reply) => {
    const summary = await service.getSummary(request.user.sub)
    return reply.send(summary)
  })
}
