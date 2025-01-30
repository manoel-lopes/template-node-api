import type { HttpRequest, HttpStatusCode } from '@/infra/http/ports/http-protocol'

export type ApiRequest = HttpRequest

export type ApiResponse = {
  status(code: HttpStatusCode): { json(body?: unknown): unknown }
  send?(data: unknown): unknown
  data?: unknown
}

type HttpRequestSchema = HttpRequest
export type HttpResponseSchema = Partial<Record<HttpStatusCode, unknown>>

export type SchemaOptions = {
  tags?: string[]
  description?: string
  headers?: unknown
  request?: HttpRequestSchema
  response?: HttpResponseSchema
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

export type HttpServer = {
  get(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  post(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  put(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  patch(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  delete(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  listen(options?: ListenOptions): Promise<void>
  close(): Promise<void>
  setErrorHandler(errorHandler: ErrorHandler): void
  use(middleware: Middleware): void
}
