import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import type { HttpServer } from '@/infra/adapters/api/http-server/ports'
import type { HttpMethod, HttpStatusCode } from '@/infra/adapters/api/ports'
import type { RouteHandler } from '@/infra/adapters/api/router/ports'
import { env } from '@/lib/env'

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
      handler: (req: FastifyRequest, res: FastifyReply) => {
        const reply = {
          status(statusCode: HttpStatusCode) {
            return {
              json(body: unknown) {
                return res.code(statusCode).send(body)
              },
            }
          },
        }
        handler(req, reply)
      },
    })
  }

  async listen(port: number): Promise<void> {
    await this.handlePromise(this.app.listen({ port }))
  }

  async close() {
    await this.handlePromise(this.app.close())
  }

  private async handlePromise(promise: Promise<unknown>): Promise<void> {
    try {
      await promise
    } catch (err) {
      this.app.log.error(err)
      process.exit(1)
    }
  }
}
