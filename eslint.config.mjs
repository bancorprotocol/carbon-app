// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
	globalIgnores([
    "**/debug/*",
    "**/pages/privacy/**/*",
    "**/pages/terms/**/*",
    "e2e/playwright-report/**/*",
    "build"
  ]),
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'], 
  reactHooks.configs['recommended-latest'],
  {
    plugins: {
      'unused-imports': unusedImports,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/jsx-curly-brace-presence": [
        "warn",
        { "props": "never", "children": "never" }
      ],
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": ["warn", {
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_",
			}]
    }
  },
  {
    files: ['*.config.{js,ts,mjs}', 'scripts/*.{js,ts,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
	prettier,
);
