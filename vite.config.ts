import path from 'node:path'
import { defineConfig, configDefaults } from 'vitest/config'

const exclude = [
  ...configDefaults.exclude,
  'src/main',
]

export default defineConfig({
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
    },
  },
  test: {
    exclude,
    globals: true,
    coverage: {
      provider: 'istanbul',
      exclude: [
        ...exclude,
        'src/lib',
        'src/util',
        'src/external',
        'src/infra/adapters/http/http-server/fasitfy',
        'src/infra/persistence/repositories/cache',
        'src/infra/validation/schemas/zod',
        'src/infra/providers/cache/redis',
        'src/infra/persistence/db',
      ],
    },
  },
})
