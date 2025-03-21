export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500

export type HttpRedirectStatusCode = 301 | 302

export type HttpRequest<
Body = unknown,
Params = unknown,
Query = unknown> = {
  body?: Body
  params?: Params
  query?: Query
}

export type HttpResponse<Body = unknown> = {
  statusCode: HttpStatusCode
  body?: Body
}
