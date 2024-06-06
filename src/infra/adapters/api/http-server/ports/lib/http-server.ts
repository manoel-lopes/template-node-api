import { HttpMethod } from '@/infra/adapters/api/ports'
import { RouteHandler } from '@/infra/adapters/api/router/ports'

export type HttpServer = {
  route(method: HttpMethod, url: string, handler: RouteHandler): void
  listen: (port: number) => Promise<void>
}
