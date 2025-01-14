type Resource = 'Question' | 'Answer' | 'User'

export class ResourceNotFoundError extends Error {
  constructor(resource: Resource) {
    super(`${resource} not found`)
    this.name = 'ResourceNotFoundError'
  }
}
