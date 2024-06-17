import type { HttpResponse } from '@/infra/adapters/http/ports'

export const created = (data: unknown): HttpResponse => ({
  statusCode: 201,
  body: data,
})

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const badRequest = ({ message }: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: { message } },
})

export const forbidden = ({ message }: Error): HttpResponse => ({
  statusCode: 403,
  body: { error: { message } },
})

export const notFound = ({ message }: Error): HttpResponse => ({
  statusCode: 404,
  body: { error: { message } },
})
