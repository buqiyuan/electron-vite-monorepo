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
    },
  },
)
