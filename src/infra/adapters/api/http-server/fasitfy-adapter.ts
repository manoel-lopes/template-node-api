import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { HttpServer } from '@/infra/adapters/api/http-server/ports'
import type { RouteHandler } from '@/presentation/routes/ports'
import type {
  ApiRequest,
  ApiResponse,
  HttpMethod,
  HttpStatusCode,
} from '@/infra/adapters/api/ports'
import { env } from '@/lib/env'

type ErrorHandler = (error: Error, req: ApiRequest, res: ApiResponse) => void

export class FastifyAdapter implements HttpServer {
  private readonly app: FastifyInstance

  constructor() {
    this.app = Fastify(
      env.NODE_ENV === 'development' ? { logger: true } : { logger: false },
    )
    this.app.register(cors)
  }

  route(method: HttpMethod, url: string, handler: RouteHandler): void {
    this.app.route({
      method,
      url,
      handler: (req: FastifyRequest, reply: FastifyReply) => {
        const res = this.adaptReply(reply)
        handler(req, res)
      },
    })
  }

  async listen(port: number): Promise<void> {
    await this.handlePromise(this.app.listen({ port }))
  }

  async close() {
    await this.handlePromise(this.app.close())
  }

  setErrorHandler(errorHandler: ErrorHandler) {
    this.app.setErrorHandler((error, req, reply) => {
      const res = this.adaptReply(reply)
      errorHandler(error, req, res)
    })
  }

  private async handlePromise(promise: Promise<unknown>): Promise<void> {
    try {
      await promise
    } catch (err) {
      this.app.log.error(err)
      process.exit(1)
    }
  }

  private adaptReply(reply: FastifyReply): ApiResponse {
    const res = {
      status(statusCode: HttpStatusCode) {
        return {
          json(body: unknown) {
            return reply.code(statusCode).send(body)
          },
        }
      },
    }
    return res
  }
}
