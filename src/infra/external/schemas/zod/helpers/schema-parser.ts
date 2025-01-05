import { z } from 'zod'
import { 
  SchemaParseFailedError
 } from '@/infra/adapters/validation/errors/schema-parse-failed-error'

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    const { error } = parsedSchema
    if (error) {
      throw this.createSchemaParseError(error.errors[0])
    }
    return parsedSchema.data
  }

  private static createSchemaParseError(errorDetail: z.ZodIssue) {
    const { path, message } = errorDetail
    const errorMessage = message.toLowerCase()
    const isObjectParamError = path.length === 3
    if (!isObjectParamError) {
      const field = path[0]
      return new SchemaParseFailedError(this.makeFieldErrorMessage(field, errorMessage),
      )
    }

    const [_, object, field] = path
    return new SchemaParseFailedError(this.makeObjectFieldErrorMessage(
      object,
      field,
      errorMessage,
    ))
  }

  private static makeFieldErrorMessage(
    field: string | number,
    errorMessage: string) {
    return `Field '${field}' ${errorMessage === 'required'
            ? 'is ' + errorMessage
            : errorMessage}`
  }

  private static makeObjectFieldErrorMessage(
    object: string | number,
    field: string | number,
    errorMessage: string) {
    return `${object} ${field} ${errorMessage}`
  }
}
