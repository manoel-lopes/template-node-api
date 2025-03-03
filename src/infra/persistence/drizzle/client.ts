import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '@/lib/env'
import { dbConfig } from './config'

const db = drizzle({
  connection: dbConfig,
  logger: env.NODE_ENV !== 'production',
})

export { db }
