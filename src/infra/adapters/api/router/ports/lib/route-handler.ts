import type { ApiRequest, ApiResponse } from '@/infra/adapters/api/ports'

export type RouteHandler = (
  req: ApiRequest,
  res: ApiResponse,
) => Promise<unknown>
