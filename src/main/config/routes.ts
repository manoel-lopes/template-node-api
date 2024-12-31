import type { HttpServer } from '@/infra/adapters/http/http-server/ports'

export function setRoutes(app: HttpServer) {
  app.get('/', async (_, res) => {
    res.status(200).json('Hello World!')
  })
}
