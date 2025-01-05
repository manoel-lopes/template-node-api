import type { HttpRequest, HttpResponse } from '@/infra/adapters/http/ports'

export type WebController = {
  handle: (req: HttpRequest) => Promise<HttpResponse>
}
