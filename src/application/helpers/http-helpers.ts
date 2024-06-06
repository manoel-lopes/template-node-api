import type { HttpResponse } from '@/infra/adapters/api/ports'

export const serverError = ({ message }: Error): HttpResponse => {
  const buildErrorMessage = () => {
    const red = '31m'
    const reset = '0m'
    return `\n\x1b[${red}{"error" :{"message": ${message}}}\x1b[${reset}`
  }

  console.log(buildErrorMessage())
  return {
    statusCode: 500,
    body: { error: { message: 'Internal server error' } },
  }
}

export const badRequest = ({ message }: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: { message } },
})

export const created = (): HttpResponse => ({ statusCode: 201 })

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})
