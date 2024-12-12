import { z } from 'zod'

const _env = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z
      .string()
      .default('3000')
      .transform((port) => Number(port)),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_NAME: z.string(),
  })
  .safeParse(process.env)

if (!_env.success) {
  const formattedErrors = Object.entries(_env.error.format())
    .filter(([key, value]) => key !== '_errors' && value && '_errors' in value)
    .map(([key]) => `${key} is required`)

  console.error('\n\x1b[1m\x1b[31m❌ Invalid environment variables:\x1b[0m')
  for (const error of formattedErrors) {
    console.error(`- ${error}`)
  }

  process.exit(1)
}

export const env = _env.data
