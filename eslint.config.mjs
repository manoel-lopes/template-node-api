import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
  }),
  {
    rules: {
      'no-useless-constructor': 'off',
      'no-var': 'error',
      '@stylistic/max-len': ['warn', {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
      }],
      '@stylistic/space-before-function-paren': ['error',
        {
          anonymous: 'always',
          asyncArrow: 'always',
          named: 'never',
        },
      ],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/multiline-ternary': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/parameter-properties': [
        'error',
        {
          allow: ['readonly', 'private readonly'],
        },
      ],
    },
  },
]
