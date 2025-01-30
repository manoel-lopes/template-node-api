import Fastify from 'fastify'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type {
  HttpServer,
  Middleware,
  RouteOptions,
  ListenOptions,
  ErrorHandler } from '@/infra/adapters/http/ports/http-server'
import type { HttpMethod } from '@/infra/http/ports/http-protocol'
import { env } from '@/lib/env'

type ServerRoute = {
  method: HttpMethod
  url: string
  options: RouteOptions
  handlers: Middleware[]
}

type RouteHandlersOptions = {
  req: FastifyRequest,
  reply: FastifyReply,
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
    await this.app.listen({ port: env.PORT, host: '0.0.0.0', ...options })
  }

  async close() {
    await this.app.close()
  }

  private registerRoute(route: ServerRoute) {
    const { options, handlers } = route
    const schema = { ...options.schema, ...options.schema?.request }
    this.app.register((instance) => {
      instance.route({ ...route, schema, handler: (req, reply) => {
        this.executeHandlers({ req, reply, handlers })
      } })
    })
  }

  private async executeHandlers(opts: RouteHandlersOptions) {
    const { handlers, req, reply } = opts
    try {
      for (const handler of [...this.middlewares, ...handlers]) {
        await handler(req, reply)
      }
    } catch (error) {
      this.app.log.error(error)
      reply.send(error)
    }
  }
}
