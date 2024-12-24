import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/**/*.ts',
    '!src/core/application/*.ts',
    '!src/**/*.{test, spec}.ts',
    '!src/application/repositories/*.ts',
    '!src/**/{models,ports,stub,in-memory,types}/**/*.ts',
  ],
  clean: true,
})
