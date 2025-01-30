import Fastify from 'fastify'
import type {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify'
import cors from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type {
  HttpServer,
  Middleware,
  RouteOptions,
  ListenOptions,
  ErrorHandler,
} from '@/infra/adapters/http/ports/http-server'
import type {
  HttpMethod,
} from '@/infra/http/ports/http-protocol'
import { env } from '@/lib/env'

type ServerRoute = {
  method: HttpMethod
  url: string
  options: RouteOptions
  handlers: Middleware[]
}

export class FastifyAdapter implements HttpServer {
  private readonly app: FastifyInstance
  private readonly middlewares: Middleware[] = []

  constructor() {
    this.app = this.createAppInstance()
    this.registerPlugins()
    Object.freeze(this)
  }

  private createAppInstance() {
    return Fastify({
      logger: env.NODE_ENV === 'development',
    }).withTypeProvider<ZodTypeProvider>()
  }

  private registerPlugins() {
    this.app.register(cors)
    this.app.setValidatorCompiler(() => { return (value) => ({ value }) })
    this.app.setSerializerCompiler(serializerCompiler)
    this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Clean Forum API',
          version: '1.0.0',
        },
      },
      transform: jsonSchemaTransform,
    })
    this.app.register(fastifySwaggerUi, { routePrefix: '/docs' })
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware)
  }

  get(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'GET', url, options, handlers })
  }

  post(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'POST', url, options, handlers })
  }

  put(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'PUT', url, options, handlers })
  }

  patch(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'PATCH', url, options, handlers })
  }

  delete(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'DELETE', url, options, handlers })
  }

  setErrorHandler(errorHandler: ErrorHandler) {
    this.app.setErrorHandler(errorHandler)
  }

  async listen(options?: ListenOptions) {
    try {
      this.app.listen({ port: env.PORT, host: '0.0.0.0', ...options })
    } catch (error) {
      this.app.log.error(error)
      process.exit(1)
    }
  }

  async close() {
    this.app.close()
  }

  private registerRoute(route: ServerRoute) {
    const { options, handlers } = route
    const schema = { ...options.schema, ...options.schema?.request }
    this.app.register((instance) => {
      instance.route({ ...route, schema, handler: async (req, reply) => {
        const allHandlers = [...this.middlewares, ...handlers]
        await this.executeHandlers(req, reply, allHandlers)
      },
      })
    })
  }

  private async executeHandlers(
    req: FastifyRequest,
    reply: FastifyReply,
    handlers: Middleware[],
    index = 0,
  ): Promise<void> {
    if (index >= handlers.length) return
    try {
      const handler = handlers[index]
      const next = () => this.executeHandlers(req, reply, handlers, index + 1)
      await handler(req, reply, next)
    } catch (error) {
      this.app.log.error(error)
    }
  }
}
