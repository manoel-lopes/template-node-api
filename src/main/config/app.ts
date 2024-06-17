import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy-adapter'
import { SchemaParseFailedError } from '@/infra/validation/errors'
import { badRequest } from '@/presentation/helpers/http-helpers'

import { setRoutes } from './routes'
import { env } from '@/lib/env'

const app = new FastifyAdapter()
setRoutes(app)
app.setErrorHandler((error, _, reply) => {
  if (error instanceof SchemaParseFailedError) {
    return badRequest(error)
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
  }

  reply.status(500).json({ error: 'Internal server error' })
})
export { app }
