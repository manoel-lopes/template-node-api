import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  clean: true,
  onSuccess: "find dist -name '*.test.js' -delete",
})
