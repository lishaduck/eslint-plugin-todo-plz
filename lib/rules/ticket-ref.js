/**
 * @fileoverview Require a ticket reference in the TODO comment
 * @author Sawyer
 */
"use strict";

// @ts-check

/**
 * @import { JSONSchema4 } from "json-schema";
 * @import { Rule } from "eslint";
 * @import * as ESTree from "estree";
 */

const messages = {
  missingTicket:
    "{{ term }} comment doesn't reference a ticket number. Ticket pattern: {{ pattern }}",
  missingTicketWithCommentPattern:
    "{{ term }} comment doesn't reference a ticket number. Comment pattern: {{ commentPattern }}",
  missingTicketWithDescription:
    "{{ term }} comment doesn't reference a ticket number. {{ description }}",
};

function getMessageId({ commentPattern, description }) {
  if (description) {
    return "missingTicketWithDescription";
  }

  if (commentPattern) {
    return "missingTicketWithCommentPattern";
  }

  return "missingTicket";
}

/** @type {JSONSchema4[]} */
const schema = [
  {
    type: "object",
    properties: {
      commentPattern: {
        type: "string",
      },
      description: {
        type: "string",
      },
      pattern: {
        type: "string",
      },
      terms: {
        type: "array",
        items: {
          type: "string",
          uniqueItems: true,
        },
      },
    },
    additionalProperties: false,
  },
];

/**
 *
 * @param {Rule.RuleContext} context
 * @returns {Rule.RuleListener}
 */
function create(context) {
  /** @type {{terms?: string[], commentPattern?: string | RegExp, pattern?: string}} */
  const {
    commentPattern,
    description,
    pattern,
    terms = ["TODO"],
  } = context.options[0];
  const sourceCode = context.sourceCode;
  const comments = sourceCode.getAllComments();
  /** @type {Record<string, RegExp>} */
  const termSearchPatterns = {};

  terms.forEach((term) => {
    termSearchPatterns[term] = new RegExp(
      commentPattern ?? `${term}\\s?\\((${pattern}[,\\s]*)+\\)`,
      "i"
    );
  });

  /**
   * Check whether an individual comment includes a valid TODO
   * @param {ESTree.Comment} comment
   */
  function validate(comment) {
    const value = comment.value;
    const includedTerms = terms.filter((term) => value.includes(term));

    if (!includedTerms.length) {
      return;
    }

    includedTerms.forEach((term) => {
      const searchPattern = termSearchPatterns[term];

      if (searchPattern.test(value)) return;

      context.report({
        loc: comment.loc,
        messageId: getMessageId({ commentPattern, description }),
        data: { commentPattern, description, pattern, term },
      });
    });
  }

  comments.forEach(validate);

  return {};
}

/** @type {Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: "Require a ticket reference in the TODO comment",
      category: "Fill me in",
      recommended: false,
      url: "https://github.com/sawyerh/eslint-plugin-todo-plz/blob/main/docs/rules/ticket-ref.md",
    },
    messages,
    schema,
    type: "suggestion",
  },
  create,
  schema,
};
