import type { ApiRequest, ApiResponse } from '@/infra/adapters/http/ports'

export type Middleware = (
  req: ApiRequest,
  res: ApiResponse,
  next: () => void
) => Promise<void>

export type RouteHandler = (
  req: ApiRequest,
  res: ApiResponse,
) => Promise<unknown>

export type ListenOptions = { port: number, host: string }
