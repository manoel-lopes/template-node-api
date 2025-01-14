import type {
  Middleware,
  RouteOptions,
  ListenOptions,
  ErrorHandler,
} from '@/infra/api/ports'

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

