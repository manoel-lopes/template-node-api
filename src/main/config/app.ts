import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { env } from '@/lib/env'

const app = new FastifyAdapter({ logger: env.NODE_ENV !== 'production' })
app.setErrorHandler(FallbackController.handle)
export { app }
