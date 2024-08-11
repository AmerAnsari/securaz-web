// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    "parserOptions": {
      "project": [
        "tsconfig.json"
      ],
      "createDefaultProgram": true
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-shadow': 'off',
      'quotes': [
        'error',
        'single',
      ],
      'max-len': [
        'error',
        {
          code: 121,
        },
      ],
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
      'semi': [
        'error',
        'always',
      ],
      'object-curly-spacing': [
        'error',
        'always',
        {
          objectsInObjects: true,
        },
      ],
      'indent': [
        'error',
        2,
        {
          SwitchCase: 1,
        },
      ],
      'no-duplicate-imports': [
        'error',
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
);
