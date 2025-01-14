import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { SchemaParseFailedError } from '@/infra/adapters/validation/errors'
import { env } from '@/lib/env'
import { setRoutes } from './routes'

const app = new FastifyAdapter()
setRoutes(app)
app.setErrorHandler((error, _, res) => {
  if (error instanceof SchemaParseFailedError) {
    const isRequiredError = error.message.includes('required')
    if (isRequiredError) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(422).json({ error: error.message })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
  }

  return res.status(500).json({ error: 'Internal server error' })
})
export { app }
