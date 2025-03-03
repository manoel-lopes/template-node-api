import Fastify from 'fastify'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type {
  HttpServer,
  Middleware,
  RouteOptions,
  ListenOptions,
  ErrorHandler
} from '@/infra/adapters/http/ports/http-server'
import type { HttpMethod } from '@/infra/http/ports/http-protocol'

type ServerRoute = {
  method: HttpMethod
  url: string
  options: RouteOptions
  handlers: Middleware[]
}

export class FastifyAdapter implements HttpServer {
  private readonly app: FastifyInstance

  constructor (private readonly config?: { logger: boolean }) {
    this.app = this.createAppInstance()
    this.registerPlugins()
  }

  private createAppInstance () {
    return Fastify({
      logger: this.config?.logger,
    }).withTypeProvider<ZodTypeProvider>()
  }

  private registerPlugins () {
    this.app.register(cors)
    this.app.setValidatorCompiler(() => (value) => ({ value }))
    this.app.setSerializerCompiler(serializerCompiler)
    this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Clean Forum API', version: '1.0.0',
        },
      },
      transform: jsonSchemaTransform,
    })
    this.app.register(fastifySwaggerUi, { routePrefix: '/docs' })
  }

  register (setupRoute: (app: HttpServer) => void) {
    setupRoute(this)
  }

  get (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'GET', url, options, handlers })
  }

  post (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'POST', url, options, handlers })
  }

  put (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'PUT', url, options, handlers })
  }

  patch (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'PATCH', url, options, handlers })
  }

  delete (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'DELETE', url, options, handlers })
  }

  setErrorHandler (errorHandler: ErrorHandler) {
    this.app.setErrorHandler(errorHandler)
  }

  async listen (options: ListenOptions) {
    await this.app.listen({ host: '0.0.0.0', ...options })
  }

  async close () {
    await this.app.close()
  }

  private registerRoute (route: ServerRoute) {
    const { options, handlers } = route
    const schema = { ...options.schema, ...options.schema?.request }
    this.app.route({ ...route, schema, handler: this.registerHandler(handlers) })
  }

  private registerHandler (handlers: Middleware[]) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        for (const handler of handlers) {
          const response = await handler(req, reply)
          if (response) reply.send(response)
        }
      } catch (error) {
        this.app.log.error(error)
        reply.send(error)
      }
    }
  }
}
