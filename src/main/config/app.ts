import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import {
  SchemaValidationError,
} from '@/infra/validation/errors/schema-validation.error'
import { badRequest, unprocessableEntity } from '@/presentation/helpers/http-helpers'
import { env } from '@/lib/env'
import { setRoutes } from './routes'

const app = new FastifyAdapter()
setRoutes(app)
app.setErrorHandler((error, _, res) => {
  if (error instanceof SchemaValidationError) {
    const isRequiredError = error.message.includes('required')
    const httpError = isRequiredError ? badRequest(error) : unprocessableEntity(error)
    return res.code(httpError.statusCode).send(httpError.body)
  }

  if (env.NODE_ENV !== 'production') {
    console.error({ errors: error.message })
  } else {
    // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
  }

  return res.code(500).send({
    error: 'Internal Server Error',
    message: 'The server encountered an unexpected condition preventing to fulfill the request',
  })
})
export { app }
