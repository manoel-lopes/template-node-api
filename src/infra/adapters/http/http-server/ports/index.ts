import type { Middleware, RouteHandler, ListenOptions } from '@/infra/api/ports'

export type HttpServer = {
  use(middleware: Middleware): void
  get(url: string, handler: RouteHandler): void
  post(url: string, handler: RouteHandler): void
  listen: (options: ListenOptions) => Promise<void>
}
