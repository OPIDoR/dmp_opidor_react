import globals from 'globals';
import pluginJs from '@eslint/js';
// import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // 'react/jsx-filename-extension': ['warn', { 'extensions': ['.js', '.jsx'] }],
      // 'react/no-array-index-key': 'off',
      // 'react/jsx-props-no-spreading': 'off',
      'no-use-before-define': 'warn',
      'consistent-return': 'off',
      'prefer-const': 'error',
    },
  },
  pluginJs.configs.recommended,
  // pluginReactConfig,
];