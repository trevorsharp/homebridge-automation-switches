const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: [ 'src/**/*.js' ],
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'commonjs',
      globals: {
        clearTimeout: 'readonly',
        console: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      indent: [ 'error', 2, { SwitchCase: 1 } ],
      'linebreak-style': [ 'error', 'unix' ],
      quotes: [ 'error', 'single' ],
      semi: [ 'error', 'always' ],
    },
  },
];
