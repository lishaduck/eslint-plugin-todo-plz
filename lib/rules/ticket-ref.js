// eslint-disable-next-line todo-plz/ticket-ref
/**
 * @fileoverview Require a ticket reference in TODO comments.
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
      commentPattern: {},
      description: {
        type: "string",
      },
      pattern: {},
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
  /** @type {{ pattern?: string | RegExp, terms?: string[], commentPattern?: string | RegExp }} */
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

  const patternSource = pattern instanceof RegExp ? pattern.source : pattern;

  terms.forEach((term) => {
    termSearchPatterns[term] = new RegExp(
      commentPattern ?? `${term}\\s?\\((${patternSource}[,\\s]*)+\\)`,
      "ui"
    );
  });

  // eslint-disable-next-line todo-plz/ticket-ref
  /**
   * Check whether an individual comment includes a valid TODO
   * @param {ESTree.Comment} comment
   * @returns {void}
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

      const commentPatternSource =
        commentPattern instanceof RegExp
          ? commentPattern.source
          : commentPattern;

      context.report({
        loc: comment.loc,
        messageId: getMessageId({ commentPattern, description }),
        data: {
          commentPattern: commentPatternSource,
          description,
          pattern: patternSource,
          term,
        },
      });
    });
  }

  comments.forEach(validate);

  return {};
}

/** @type {Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "require a ticket reference in the TODO comment",
      recommended: false,
      url: "https://github.com/sawyerh/eslint-plugin-todo-plz/blob/main/docs/rules/ticket-ref.md",
    },
    schema,
    messages,
  },
  create,
  schema,
};
