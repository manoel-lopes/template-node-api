import { z } from 'zod'
import {
  SchemaValidationError,
} from '@/infra/adapters/validation/errors/schema-validation.error'

type FieldError = {
  field: string | number,
  errorMessage: string
}

type ObjectFieldError = {
  object: string | number,
  field: string | number,
  errorMessage: string
}

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
    const isObjectFieldError = path.length === 3
    if (!isObjectFieldError) {
      const field = path[0]
      return new SchemaValidationError(this.formatPluralString(
        this.makeFieldErrorMessage({
          field,
          errorMessage,
        }),
      ))
    }

    const [_, object, field] = path
    return new SchemaValidationError(this.formatPluralString(
      this.makeObjectFieldErrorMessage({
        object,
        field,
        errorMessage,
      }),
    ))
  }

  private static makeFieldErrorMessage(fieldError: FieldError) {
    const { field, errorMessage } = fieldError
    return `Field '${field}' ${errorMessage === 'required'
            ? 'is ' + errorMessage
            : errorMessage}`
  }

  private static makeObjectFieldErrorMessage(objFieldError: ObjectFieldError) {
    const { object, field, errorMessage } = objFieldError
    return `${object} ${field} ${errorMessage}`
  }

  private static formatPluralString(str: string) {
    return str.replace(/(\d+)\scharacter\(s\)/g, (_, num) => {
      return `${num} character${num > 1 ? 's' : ''}`
    })
  }
}
