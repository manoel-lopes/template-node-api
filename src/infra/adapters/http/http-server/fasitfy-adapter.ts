import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import type {
  Middleware,
  RouteHandler,
  ListenOptions,
} from '@/infra/api/ports'
import type {
  ApiRequest,
  ApiResponse,
  HttpMethod,
  HttpStatusCode,
} from '@/infra/adapters/http/ports'
import { env } from '@/lib/env'

type ErrorHandler = (error: Error, req: ApiRequest, res: ApiResponse) => void

export class FastifyAdapter implements HttpServer {
  private readonly app: FastifyInstance
  private readonly middlewares: Middleware[] = []

  constructor() {
    this.app = this.createAppInstance()
    this.registerPlugins()
    Object.freeze(this)
  }

  private createAppInstance() {
    return Fastify({ logger: env.NODE_ENV === 'development' })
  }

  private registerPlugins() {
    this.app.register(cors)
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware)
  }

  get(url: string, handler: RouteHandler) {
    this.registerRoute('GET', url, handler)
  }

  post(url: string, handler: RouteHandler) {
    this.registerRoute('POST', url, handler)
  }

  put(url: string, handler: RouteHandler) {
    this.registerRoute('PUT', url, handler)
  }

  patch(url: string, handler: RouteHandler) {
    this.registerRoute('PATCH', url, handler)
  }

  delete(url: string, handler: RouteHandler) {
    this.registerRoute('DELETE', url, handler)
  }

  setErrorHandler(errorHandler: ErrorHandler) {
    this.app.setErrorHandler((error, req, reply) => {
      const res = this.createApiResponse(reply)
      errorHandler(error, req, res)
    })
  }

  async listen(options: ListenOptions) {
    await this.handlePromise(this.app.listen({ ...options }))
  }

  async close() {
    await this.handlePromise(this.app.close())
  }

  private registerRoute(method: HttpMethod, url: string, handler: RouteHandler) {
    this.app.route({
      method,
      url,
      handler: (req, reply) => this.handleRequest(req, reply, handler),
    })
  }

  private async handleRequest(
    req: FastifyRequest,
    reply: FastifyReply,
    handler: RouteHandler,
  ) {
    const res = this.createApiResponse(reply)
    try {
      await this.executeMiddlewares(req, res, handler)
    } catch (error) {
      this.app.log.error(error)
      reply.send(error)
    }
  }

  private async executeMiddlewares(
    req: FastifyRequest,
    res: ApiResponse,
    handler: RouteHandler,
  ) {
    let index = 0
    const next = async () => {
      index++
      if (index < this.middlewares.length) {
        this.middlewares[index](req, res, next)
      } else {
        await handler(req, res)
      }
    }

    if (this.middlewares.length > 0) {
      await this.middlewares[0](req, res, next)
    } else {
      await handler(req, res)
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

  private createApiResponse(reply: FastifyReply): ApiResponse {
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
