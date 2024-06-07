import { created } from './../../../application/helpers/http-helpers'
import { z } from 'zod'
import { SchemaParseFailedError } from '@/infra/validation/errors'
import type { HttpRequest, HttpResponse } from '@/infra/adapters/http/ports'

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    const { error } = parsedSchema
    if (error) {
      const { path, message } = error.errors[0]
      const errorMessage = message.toLowerCase()
      const isObjectParamError = path.length === 3
      if (!isObjectParamError) {
        const param = path[1]
        throw new SchemaParseFailedError(`${param} ${errorMessage}`)
      }

      const object = path[1]
      const param = path[2]
      throw new SchemaParseFailedError(`${object} ${param} ${errorMessage}`)
    }
    return parsedSchema.data
  }
}
