import { FastifyAdapter } from '@/infra/adapters/api/http-server/fastify'
import { setRoutes } from './routes'

const app = new FastifyAdapter()
setRoutes(app)
export { app }
