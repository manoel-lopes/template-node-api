import type { SchemaResult, SchemaValidator } from '../ports/schema-validator'

export class SchemaValidatorStub<T=SchemaResult> implements SchemaValidator<T> {
  validate() {
    return {} as T
  }
}
