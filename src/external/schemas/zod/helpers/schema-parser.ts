import { z } from 'zod'
import {
  SchemaValidationError,
} from '@/infra/adapters/validation/errors/schema-validation.error'

type FieldError = {
  field: string | number,
  message: string
}

type ObjectFieldError = {
  object: string | number,
  field: string | number,
  message: string
}

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    const { error } = parsedSchema
    if (error) {
      throw new SchemaValidationError(this.formatPluralString(
        this.makeSchemaValidationErrorMessage(error.errors[0]),
      ))
    }
    return parsedSchema.data
  }

  private static makeSchemaValidationErrorMessage(issues: z.ZodIssue) {
    const { path, message } = issues
    const msg = message.toLowerCase()
    const isObjectFieldError = path.length === 3
    if (!isObjectFieldError) {
      const field = path[0]
      return this.makeFieldErrorMessage({ field, message: msg })
    }

    const [_, object, field] = path
    return this.makeObjectFieldErrorMessage({ object, field, message: msg })
  }

  private static makeFieldErrorMessage(error: FieldError) {
    const { field, message } = error
    const msg = message === 'required' ? `is ${message}` : message
    return `Field '${field}' ${msg}`
  }

  private static makeObjectFieldErrorMessage(error: ObjectFieldError) {
    const { object, field, message } = error
    return `${object} ${field} ${message}`
  }

  private static formatPluralString(str: string) {
    return str.replace(/(\d+)\scharacter\(s\)/g, (_, num) => {
      return `${num} character${num > 1 ? 's' : ''}`
    })
  }
}
