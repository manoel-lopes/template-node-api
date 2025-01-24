export type SchemaParseResult = Record<string, unknown>

export type SchemaValidator<T=SchemaParseResult> = {
  validate: (data: unknown) => T
}
