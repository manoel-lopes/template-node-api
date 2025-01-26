export type HttpErrorType =
'Bad Request'
| 'Unauthorized'
| 'Forbidden'
| 'Not Found'
| 'Conflict'
| 'Unprocessable Entity'

export class HttpError extends Error {
  constructor(readonly name: HttpErrorType, message: string) {
    super(message)
  }
}
