import type { SchemaParseResult, SchemaValidator } from '@/infra/validation/ports/schema.validator'

export class SchemaValidatorStub<T=SchemaParseResult> implements SchemaValidator<T> {
  validate () {
    return {} as T
  }
}
