import 'dotenv/config'
import Fastify from 'fastify'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { registerCors } from './plugins/cors.js'
import { registerJwt } from './plugins/jwt.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js'
import { transactionsRoutes } from './modules/transactions/transactions.routes.js'
import { operationsRoutes } from './modules/operations/operations.routes.js'

const app = Fastify({
  logger: {
    transport:
      env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
})

async function bootstrap() {
  // Plugins
  await registerCors(app)
  await registerJwt(app)

  // Error handler
  app.setErrorHandler(errorHandler)

  // Routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' })
  await app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' })
  await app.register(transactionsRoutes, { prefix: '/api/v1/transactions' })
  await app.register(operationsRoutes, { prefix: '/api/v1/operations' })

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`🌾 FeeAgro API running on http://localhost:${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()
