export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500

type Body = Record<string, unknown>
type Params = Record<string, unknown>
type Query = Record<string, unknown>

export type HttpRequest = {
  body?: Body
  params?: Params
  query?: Query
}

export type HttpResponse = {
  statusCode: HttpStatusCode
  body?: unknown
}
