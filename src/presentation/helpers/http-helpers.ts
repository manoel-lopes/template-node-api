import type { HttpResponse, HttpStatusCode } from '@/infra/http/ports'

export const created = (): HttpResponse => ({ statusCode: 201 })

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})

const error = (err: Error, statusCode: HttpStatusCode): HttpResponse => ({
  statusCode,
  body: { error: { message: err.message } },
})

export const badRequest = (err: Error): HttpResponse => {
  return error(err, 400)
}

export const unauthorized = (err: Error): HttpResponse => {
  return error(err, 401)
}

export const forbidden = (err: Error): HttpResponse => {
  return error(err, 403)
}

export const notFound = (err: Error): HttpResponse => {
  return error(err, 404)
}

export const conflict = (err: Error): HttpResponse => {
  return error(err, 409)
}

export const unprocessable = (err: Error): HttpResponse => {
  return error(err, 422)
}
