export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500

type Body = unknown
type Params = unknown
type Query = unknown

export type HttpRequest = {
  body?: Body
  params?: Params
  query?: Query
}

export type HttpResponse = {
  statusCode: HttpStatusCode
  body?: Body
}
