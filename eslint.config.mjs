import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import vitest from '@vitest/eslint-plugin'

const noUnusedVarsConfig = ['error',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  }]

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
  }),
  {
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      'no-useless-constructor': 'off',
      'no-var': 'error',
      'no-unused-vars': noUnusedVarsConfig,
      '@stylistic/max-len': ['warn', {
        code: 98,
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
      '@typescript-eslint/no-unused-vars': noUnusedVarsConfig,
    },
  },
]
