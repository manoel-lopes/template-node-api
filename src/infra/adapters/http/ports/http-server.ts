import type { Middleware, ListenOptions, RouteOptions, ErrorHandler } from '@/infra/api/ports'

export type HttpServer = {
  use(middleware: Middleware): void
  use(middleware: Middleware): void
  get(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  post(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  put(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  patch(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  delete(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  setErrorHandler(errorHandler: ErrorHandler): void
  listen(options?: ListenOptions): Promise<void>
  close(): Promise<void>
}
