import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../utils/api-error.js'

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.error,
      message: error.message,
      ...(error.details && { details: error.details }),
    })
  }

  // Fastify validation error (JSON Schema)
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'VALIDATION_ERROR',
      message: 'Dados inválidos',
      details: error.validation.map((v) => ({
        field: v.instancePath?.replace('/', '') ?? 'body',
        message: v.message ?? 'Inválido',
      })),
    })
  }

  // JWT errors
  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID' ||
      error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
    return reply.status(401).send({
      statusCode: 401,
      error: 'UNAUTHORIZED',
      message: 'Token inválido ou expirado',
    })
  }

  // Unexpected errors
  console.error('[Unhandled Error]', error)
  return reply.status(500).send({
    statusCode: 500,
    error: 'INTERNAL_ERROR',
    message: 'Erro interno do servidor',
  })
}
