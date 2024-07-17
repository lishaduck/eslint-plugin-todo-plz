"use strict";

const packageJson = require("../package.json");

/** @type {import('eslint').ESLint.Plugin} */
module.exports = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
  rules: {
    "ticket-ref": require("./rules/ticket-ref"),
  },
};
