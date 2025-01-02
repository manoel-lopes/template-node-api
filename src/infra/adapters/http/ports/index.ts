export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 403 | 404 | 409 | 500

export type HttpRequest = {
  body?: unknown
  params?: unknown
  query?: unknown
}

export type HttpResponse = {
  statusCode: HttpStatusCode
  body?: unknown
}
