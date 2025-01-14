import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import {
  SchemaValidationError,
} from '@/infra/adapters/validation/errors/schema-validation.error'
import { badRequest, unprocessable } from '@/presentation/helpers/http-helpers'
import { env } from '@/lib/env'
import { setRoutes } from './routes'

const app = new FastifyAdapter()
setRoutes(app)
app.setErrorHandler((error, _, res) => {
  if (error instanceof SchemaValidationError) {
    const isRequiredError = error.message.includes('required')
    const httpError = isRequiredError ? badRequest(error) : unprocessable(error)
    return res.status(httpError.statusCode).json(httpError.body)
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
  }

  return res.status(500).json({ error: 'Internal server error' })
})
export { app }
