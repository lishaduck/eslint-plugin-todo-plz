import eslint from "@eslint/js";
import todoPlz from "./lib/index.js";
import eslintPlugin from "eslint-plugin-eslint-plugin";

/**
 * @import {Linter} from 'eslint'
 */

/**
 * @type {Linter.FlatConfig[]}
 */
export default [
  {
    ignores: ["tests/integration/**"],
  },
  {
    files: ["lib/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: eslint.configs.recommended.rules,
  },
  {
    files: ["lib/**/*.js"],
    plugins: { "todo-plz": todoPlz },
    rules: {
      "todo-plz/ticket-ref": ["error", { pattern: "#[0-9]+" }],
    },
  },
  {
    files: ["lib/**/*.js"],
    plugins: { "eslint-plugin": eslintPlugin },
    rules: {
      ...eslintPlugin.configs["flat/rules"].rules,
      "eslint-plugin/require-meta-docs-url": "error",
    },
  },
  {
    files: ["tests/**/*.js"],
    plugins: { "eslint-plugin": eslintPlugin },
    rules: eslintPlugin.configs["flat/tests"].rules,
  },
];
