import todoPlz from "eslint-plugin-todo-plz";

/**
 * @import {Linter} from "eslint"
 */

/** @type {Linter.FlatConfig[]} */
export default [
  {
    plugins: { "todo-plz": todoPlz },
    rules: {
      "todo-plz/ticket-ref": ["error", { pattern: "PROJ-[0-9]+" }],
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: ["commentPattern.js"],
    rules: {
      "todo-plz/ticket-ref": [
        "error",
        { commentPattern: "TODO:\\s\\[(PROJ-[0-9]+[,\\s]*)+\\]" },
      ],
    },
  },
];
