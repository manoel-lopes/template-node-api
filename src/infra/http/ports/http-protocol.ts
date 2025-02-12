export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500

export type BodyParams = Record<string, unknown>
export type RouteParams = Record<string, string>
export type QueryParams = unknown
export type HttpRequest<Body = BodyParams, Params = RouteParams, Query = QueryParams> = {
  body?: Body
  params?: Params
  query?: Query
}

export type HttpResponse<Body = unknown> = {
  statusCode: HttpStatusCode
  body?: Body
}
