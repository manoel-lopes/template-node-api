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
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import type {
  Middleware,
  RouteOptions,
  ListenOptions,
  ErrorHandler,
} from '@/infra/api/ports'
import type {
  HttpMethod,
  HttpStatusCode,
} from '@/infra/http/ports'
import { env } from '@/lib/env'

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
    this.app.setValidatorCompiler(validatorCompiler)
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
    this.registerRoute('GET', url, options, handlers)
  }

  post(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute('POST', url, options, handlers)
  }

  put(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute('PUT', url, options, handlers)
  }

  patch(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute('PATCH', url, options, handlers)
  }

  delete(url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute('DELETE', url, options, handlers)
  }

  setErrorHandler(errorHandler: ErrorHandler) {
    this.app.setErrorHandler((error, req, reply) => {
      const res = this.createApiResponse(reply)
      errorHandler(error, req, res)
    })
  }

  async listen(options?: ListenOptions) {
    await this.handlePromise(
      this.app.listen({
        port: env.PORT,
        host: '0.0.0.0',
        ...options,
      }),
    )
  }

  async close() {
    await this.handlePromise(this.app.close())
  }

  private registerRoute(
    method: HttpMethod,
    url: string,
    options: RouteOptions,
    handlers: Middleware[],
  ) {
    this.app.register((instance) => {
      instance.route({
        method,
        url,
        schema: options.schema,
        handler: (req, reply) => this.handleRequest(req, reply, handlers),
      })
    })
  }

  private async handleRequest(
    req: FastifyRequest,
    reply: FastifyReply,
    handlers: Middleware[],
  ) {
    const res = this.createApiResponse(reply)
    const allHandlers = [...this.middlewares, ...handlers]
    let index = 0
    const next = async () => {
      if (index < allHandlers.length) {
        const handler = allHandlers[index]
        index++
        const result = handler(req, res, next)
        if (result instanceof Promise) {
          await result
        }
      }
    }
    try {
      await next()
    } catch (error) {
      this.app.log.error(error)
      reply.send(error)
    }
  }

  private async handlePromise(promise: Promise<unknown>) {
    try {
      await promise
    } catch (error) {
      this.app.log.error(error)
      process.exit(1)
    }
  }

  private createApiResponse(reply: FastifyReply) {
    return {
      status(statusCode: HttpStatusCode) {
        return {
          json(body: unknown) {
            return reply.code(statusCode).send(body)
          },
        }
      },
    }
  }
}
