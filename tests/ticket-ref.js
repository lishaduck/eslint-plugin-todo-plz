const RuleTester = require("eslint").RuleTester;
const rule = require("../lib/rules/ticket-ref");
const ruleTester = new RuleTester();

const pattern = /PROJ-[0-9]+/;
const commentPattern = /TODO:\s\[(PROJ-[0-9]+[,\s]*)+\]/;
const description = "Example: TODO: [https://jira.net/browse/TASK-0000]";

const messages = {
  missingTodoTicket: `TODO comment doesn't reference a ticket number. Ticket pattern: ${pattern.source}`,
  missingTodoTicketWithCommentPattern: `TODO comment doesn't reference a ticket number. Comment pattern: ${commentPattern.source}`,
  missingTicketWithDescription: `TODO comment doesn't reference a ticket number. ${description}`,
  missingFixmeTicket: `FIXME comment doesn't reference a ticket number. Ticket pattern: ${pattern.source}`,
};

const options = {
  jira: {
    pattern,
  },
};

ruleTester.run("ticket-ref", rule, {
  valid: [
    {
      code: "// TODO (PROJ-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "// TODO (PROJ-123, PROJ-456): Connect to the API",
      options: [options.jira],
    },
    {
      code: "//TODO (PROJ-123) Connect to the API",
      options: [options.jira],
    },
    {
      code: "// TODO(PROJ-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "/* TODO(PROJ-123): Connect to the API */",
      options: [options.jira],
    },
    {
      code: "// todo (PROJ-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "// The API",
      options: [options.jira],
    },
    {
      code: `/**
              * Description
              * TODO (PROJ-123): Connect to the API
              * @returns {string}
              */`,
      options: [options.jira],
    },
    {
      code: `/**
              * Description
              * @returns {string}
              */`,
      options: [options.jira],
    },
    {
      code: "// TODO: Connect to the API",
      options: [{ pattern, terms: ["FIXME"] }],
    },
    {
      code: "// FIXME (PROJ-2): Connect to the API",
      options: [{ pattern, terms: ["FIXME"] }],
    },
    {
      code: "// TODO: [PROJ-2] Connect to the API",
      options: [{ commentPattern }],
    },
    {
      code: `/**
              * Description
              * TODO: [PROJ-123] Connect to the API
              * @returns {string}
              */`,
      options: [{ commentPattern }],
    },
    {
      code: "// TODO (PROJ-2): Connect to the API",
      options: [{ pattern, description }],
    },
    {
      code: `/**
              * Description
              * TODO (PROJ-123): Connect to the API
              * @returns {string}
              */`,
      options: [{ pattern, description }],
    },
  ],

  invalid: [
    {
      code: "// TODO: Connect to the API",
      options: [options.jira],
      errors: [
        {
          message: messages.missingTodoTicket,
        },
      ],
    },
    {
      code: "// TODO (a-1): Connect to the API",
      options: [options.jira],
      errors: [
        {
          message: messages.missingTodoTicket,
        },
      ],
    },
    {
      code: `/**
              * Description
              * TODO: Connect to the API
              * @returns {string}
              */`,
      options: [options.jira],
      errors: [
        {
          message: messages.missingTodoTicket,
        },
      ],
    },
    {
      code: "// FIXME: Connect to the API",
      options: [{ pattern, terms: ["FIXME"] }],
      errors: [{ message: messages.missingFixmeTicket }],
    },
    {
      code: "// TODO (PROJ-123) Connect to the API",
      options: [{ commentPattern }],
      errors: [{ message: messages.missingTodoTicketWithCommentPattern }],
    },
    {
      code: "// TODO (PROJ-123) Connect to the API",
      options: [{ description }],
      errors: [{ message: messages.missingTicketWithDescription }],
    },
  ],
});
