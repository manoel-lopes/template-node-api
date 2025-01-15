export type SchemaResult = Record<string, unknown>

export type SchemaValidator<T=SchemaResult> = {
  validate: (data: unknown) => T
}
