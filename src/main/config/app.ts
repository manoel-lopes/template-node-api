import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import {
  SchemaParseFailedError,
} from '@/infra/adapters/validation/errors/schema-parse-failed.error'
import { badRequest, unprocessable } from '@/presentation/helpers/http-helpers'
import { env } from '@/lib/env'
import { setRoutes } from './routes'

const app = new FastifyAdapter()
setRoutes(app)
app.setErrorHandler((error, _, res) => {
  if (error instanceof SchemaParseFailedError) {
    const isRequiredError = error.message.includes('required')
    const { statusCode, body } = isRequiredError
      ? badRequest(error)
      : unprocessable(error)
    return res.status(statusCode).json(body)
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
  }

  return res.status(500).json({ error: 'Internal server error' })
})
export { app }

