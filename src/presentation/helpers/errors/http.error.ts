type HppErrorType =
'Bad Request'
| 'Unauthorized'
| 'Forbidden'
| 'Not Found'
| 'Conflict'
| 'Unprocessable Entity'

export class HttpError extends Error {
  constructor(name: HppErrorType, message: string) {
    super(message)
    this.name = name
  }
}
