import type { HttpRequest, HttpStatusCode } from '@/infra/http/ports/http-protocol'

export type ApiRequest = HttpRequest

export type ApiResponse = {
  status(code: HttpStatusCode): { json(body?: unknown): unknown }
  send?(data: unknown): unknown
  data?: unknown
}

export type SchemaOptions = {
  tags?: string[]
  description?: string
  body?: unknown
  params?: unknown
  query?: unknown
  headers?: unknown
  response?: Record<number, unknown>
}

export type RouteOptions = {
  schema?: SchemaOptions
}

export type Middleware = (
  req: ApiRequest,
  res: ApiResponse,
  next?: () => void
) => Promise<unknown> | void

export type ListenOptions = { port: number, host: string }

export type ErrorHandler = (error: Error, req: ApiRequest, res: ApiResponse) => void
