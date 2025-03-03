import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'

const app = new FastifyAdapter()
app.setErrorHandler(FallbackController.handle)
export { app }
