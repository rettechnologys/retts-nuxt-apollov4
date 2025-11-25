// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'coverage',
      'cypress',
      'Gruntfile.js',
      'public/face_mesh/**/*',
      '.nuxt',
      '.output'
    ]
  },
  {
    files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
    rules: {
      // Cypress recommended rules can be added here if needed
    }
  }
)
