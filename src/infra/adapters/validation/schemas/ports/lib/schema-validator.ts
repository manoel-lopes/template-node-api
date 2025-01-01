export type SchemaValidator<T=unknown> = {
  validate: (data: unknown) => T
}

