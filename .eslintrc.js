module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    webextensions: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // Basic rules for extension development
    'no-console': 'off', // Allow console.log in extensions
    'no-unused-vars': 'off', // Use TypeScript version instead
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-undef': 'off', // TypeScript handles this
    'prefer-const': 'warn',
    'no-var': 'error',
  },
  ignorePatterns: [
    'dist/',
    'store/',
    'node_modules/',
    '*.js', // Ignore JS files in root
    'webpack.config.js',
    'jest.config.js',
    '.eslintrc.js',
  ],
};
