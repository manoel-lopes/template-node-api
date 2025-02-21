import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { setRoutes } from './routes'

const app = new FastifyAdapter()
setRoutes(app)
app.setErrorHandler(FallbackController.handle)
export { app }
