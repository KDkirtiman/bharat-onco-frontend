import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

// Matches #fff, #ffffff, #ffffffff (with alpha) as a whole token.
const HEX_COLOR = '#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '.storybook/**', '**/*.stories.tsx'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['scripts/**/*.mjs', '*.config.{js,mjs,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    // Reuse guardrail: this repo is the single source of truth for the design
    // system, so colors and icons belong in bfd-themes / bfd-icons — not
    // re-hardcoded per-component, which is how palettes and icon sets drift.
    files: ['packages/**/*.{ts,tsx}'],
    ignores: ['packages/bfd-themes/**', 'packages/bfd-icons/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=/${HEX_COLOR}/], TemplateElement[value.raw=/${HEX_COLOR}/]`,
          message:
            'No hardcoded hex colors outside bfd-themes. Add/reuse a token in packages/bfd-themes/tokens and import it instead.',
        },
        {
          selector: "JSXOpeningElement[name.name='svg']",
          message:
            'No inline <svg> markup outside bfd-icons. Add the icon to packages/bfd-icons and import it so icons stay de-duplicated.',
        },
      ],
    },
  },
);
