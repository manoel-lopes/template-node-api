import { z } from 'zod'
import type {
  SchemaParseResult,
} from '@/infra/adapters/validation/schemas/ports/schema-validator'
import { SchemaValidationError } from '@/infra/adapters/validation/errors/schema-validation.error'

export abstract class SchemaParser {
  static parse<T = SchemaParseResult>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    if (!parsedSchema.success) {
      const errorMessage = this.formatValidationErrorMessage(
        this.makeSchemaValidationErrorMessage(parsedSchema.error.errors[0]),
      )
      throw new SchemaValidationError(errorMessage)
    }
    return parsedSchema.data
  }

  private static makeSchemaValidationErrorMessage(issue: z.ZodIssue): string {
    const { path, message } = issue
    const field = path[0]
    const msg = message.toLowerCase()
    if (path.length === 1) {
      return this.getFieldErrorMessage(String(field), msg)
    }
    const [_, object, subField] = path
    return `${object} ${subField} ${msg}`
  }

  private static getFieldErrorMessage(field: string, msg: string): string {
    if (msg.includes('invalid')) {
      return `Invalid ${field}`
    }
    return `Field '${field}' ${msg === 'required' ? `is ${msg}` : msg}`
  }

  private static formatValidationErrorMessage(message: string): string {
    return message.replace(/(\d+)\scharacter\(s\)/g, (_, num) => {
      return `${num} character${num > 1 ? 's' : ''}`
    })
  }
}
