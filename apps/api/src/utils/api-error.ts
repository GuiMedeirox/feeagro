export class AppError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
    public details?: { field: string; message: string }[]
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(404, 'NOT_FOUND', `${resource} não encontrado`)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: { field: string; message: string }[]) {
    super(400, 'BAD_REQUEST', message, details)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message)
  }
}
