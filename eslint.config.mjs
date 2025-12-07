import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    // unocss: true,
    vue: true,
    typescript: true,
    // ignores: [ ],
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'no-console': 'off',
      'n/prefer-global/process': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'unused-imports/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
          varsIgnorePattern: '^_', // 忽略以 _ 开头的变量
          argsIgnorePattern: '^_', // 忽略以 _ 开头的参数
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
          internalPattern: ['^~/', '^/@/', '^@/'],
          newlinesBetween: 'never',
          maxLineLength: undefined,
          groups: [
            'type',
            ['side-effect', 'side-effect-style'],
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          customGroups: { type: {}, value: {} },
          environment: 'node',
        },
      ],
    },
  },
)
