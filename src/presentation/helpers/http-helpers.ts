import type { HttpResponse, HttpStatusCode } from '@/infra/http/ports'
import { HttpError } from './errors/http.error'

export const created = (): HttpResponse => ({ statusCode: 201 })

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})

const httpError = (err: HttpError, statusCode: HttpStatusCode): HttpResponse => ({
  statusCode,
  body: {
    statusCode,
    error: err.name,
    message: err.message,
  },
})

export const badRequest = (err: Error): HttpResponse => {
  const error = new HttpError('Bad Request', err.message)
  return httpError(error, 400)
}

export const unauthorized = (err: Error): HttpResponse => {
  const error = new HttpError('Unauthorized', err.message)
  return httpError(error, 401)
}

export const forbidden = (err: Error): HttpResponse => {
  const error = new HttpError('Forbidden', err.message)
  return httpError(error, 403)
}

export const notFound = (err: Error): HttpResponse => {
  const error = new HttpError('Not Found', err.message)
  return httpError(error, 404)
}

export const conflict = (err: Error): HttpResponse => {
  const error = new HttpError('Conflict', err.message)
  return httpError(error, 409)
}

export const unprocessable = (err: Error): HttpResponse => {
  const error = new HttpError('Unprocessable Entity', err.message)
  return httpError(error, 422)
}
