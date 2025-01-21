import { z } from 'zod'
import {
  SchemaValidationError,
} from '@/infra/adapters/validation/errors/schema-validation.error'

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    const { error } = parsedSchema
    if (error) {
      throw new SchemaValidationError(this.formatValidationErrorMessage(
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
      return `Field '${field}' ${msg === 'required' ? `is ${msg}` : msg}`
    }

    const [_, object, field] = path
    return `${object} ${field} ${msg}`
  }

  private static formatValidationErrorMessage(message: string) {
    return message.replace(/(\d+)\scharacter\(s\)/g, (_, num) => {
      return `${num} character${num > 1 ? 's' : ''}`
    })
  }
}
