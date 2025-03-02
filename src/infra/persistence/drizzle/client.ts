import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '@/lib/env'

export const dbCredentials = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.NODE_ENV === 'production',
}

const db = drizzle({
  connection: dbCredentials,
  logger: env.NODE_ENV !== 'production',
})

export { db }
