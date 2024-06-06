import type { HttpServer } from '@/infra/adapters/api/http-server/ports'
import type { HttpMethod } from '@/infra/adapters/api/ports'
import type { RouteHandler } from './ports'

export class Router {
  constructor(private readonly httpServer: HttpServer) {}
  route(method: HttpMethod, uri: string, handler: RouteHandler): void {
    this.httpServer.route(method, uri, handler)
  }
}
