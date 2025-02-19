import type { HttpServer } from '@/infra/adapters/http/ports/http-server'

export function setRoutes (app: HttpServer) {
  app.get('/', {}, async (_, res) => {
    res.status(200).json('Hello World!')
  })
}
