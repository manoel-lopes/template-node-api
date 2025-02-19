import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import type { ApiRequest, ApiResponse } from '@/infra/adapters/http/ports/http-server'
import { FallbackController } from './fallback.controller'

const mockResponse = () => {
  const res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn(),
  }
  return res
}

describe('FallbackController', () => {
  const mocks = vi.hoisted(() => ({
    env: {
      NODE_ENV: 'development',
    }
  }))

  beforeEach(() => {
    vi.spyOn(console, 'error').mockClear()
  })

  vi.mock('@/lib/env', () => mocks)

  it('should handle a schema validation error sending a bad request error http response', () => {
    const error = new SchemaValidationError('Field is required')
    const res = mockResponse()

    FallbackController.handle(error, {} as ApiRequest, res as unknown as ApiResponse)

    expect(res.code).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: error.message,
    })
  })

  it('should handle an schema validation error with unprocessable entity error http response', () => {
    const error = new SchemaValidationError('Invalid format')
    const res = mockResponse()

    FallbackController.handle(error, {} as ApiRequest, res as unknown as ApiResponse)

    expect(res.code).toHaveBeenCalledWith(422)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Unprocessable Entity',
      message: error.message,
    })
  })

  it('should log an unexpected error and return an internal server error http response', () => {
    const error = new Error('Unexpected error')
    const res = mockResponse()
    vi.spyOn(console, 'error').mockImplementation(() => {})

    FallbackController.handle(error, {} as ApiRequest, res as unknown as ApiResponse)

    expect(console.error).toHaveBeenCalledWith({ errors: error.message })
    expect(res.code).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'The server encountered an unexpected condition preventing to fulfill the request',
    })
  })

  it('should not log error in production and return an internal server error http response', () => {
    mocks.env.NODE_ENV = 'production'
    const error = new Error('Unexpected error')
    const res = mockResponse()
    vi.spyOn(console, 'error').mockImplementation(() => {})

    FallbackController.handle(error, {} as ApiRequest, res as unknown as ApiResponse)

    expect(console.error).not.toHaveBeenCalled()
    expect(res.code).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'The server encountered an unexpected condition preventing to fulfill the request',
    })
  })
})
