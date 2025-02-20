import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import type { ApiRequest, ApiResponse } from '@/infra/adapters/http/ports/http-server'
import { badRequest, unprocessableEntity } from '@/presentation/helpers/http-helpers'
import { env } from '@/lib/env'

export abstract class FallbackController {
  static handle (error: Error, _: ApiRequest, res: ApiResponse) {
    if (error instanceof SchemaValidationError) {
      const isEmptyRequestBodyError = error.message.includes('empty')
      if (isEmptyRequestBodyError) {
        return badRequest(error)
      }

      const isRequiredError = error.message.includes('required')
      const httpError = isRequiredError ? badRequest(error) : unprocessableEntity(error)
      return res.code(httpError.statusCode).send(httpError.body)
    }

    this.logError(error)
    return res.code(500).send({
      error: 'Internal Server Error',
      message: 'The server encountered an unexpected condition preventing to fulfill the request',
    })
  }

  private static logError (error: Error) {
    if (env.NODE_ENV !== 'production') {
      console.error({ errors: error.message })
    } else {
      // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
    }
  }
}
