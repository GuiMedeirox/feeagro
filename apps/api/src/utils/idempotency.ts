import { prisma } from '../config/database.js'

const TTL_MS = 24 * 60 * 60 * 1000 // 24h

/**
 * Garante que a operação seja executada no máximo uma vez para a chave dada.
 * Se já existir um registro válido, retorna o resultado cacheado sem executar o handler.
 */
export async function withIdempotency<T extends object>(
  key: string,
  userId: string,
  statusCode: number,
  handler: () => Promise<T>,
): Promise<{ result: T; cached: boolean }> {
  const existing = await prisma.idempotencyRecord.findUnique({
    where: { key_userId: { key, userId } },
  })

  if (existing) {
    if (existing.expiresAt > new Date()) {
      return { result: existing.response as T, cached: true }
    }
    // Registro expirado — remove e processa normalmente
    await prisma.idempotencyRecord.delete({ where: { id: existing.id } })
  }

  const result = await handler()

  await prisma.idempotencyRecord.create({
    data: {
      key,
      userId,
      statusCode,
      response: result,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  })

  return { result, cached: false }
}
