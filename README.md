# eslint-plugin-todo-plz

Enforce consistent and maintainable TODO comments.

![A screenshot of ESLint output in the editor, displaying "TODO comment doesn't reference a ticket number. Ticket pattern: PROJ-\[0-9\]+""](.github/assets/screenshot.png)

## Installation

You'll first need to install [ESLint](https://eslint.org):

```sh
npm install --save-dev eslint
```

Next, install `eslint-plugin-todo-plz`:

```sh
npm install --save-dev eslint-plugin-todo-plz
```

## Usage

Add `todo-plz` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["todo-plz"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "todo-plz/ticket-ref": ["error", { "pattern": "PROJ-[0-9]+" }]
  }
}
```

## Supported Rules

<!-- begin auto-generated rules list -->

| Name                                   | Description                                    |
| :------------------------------------- | :--------------------------------------------- |
| [ticket-ref](docs/rules/ticket-ref.md) | Require a ticket reference in the TODO comment |

<!-- end auto-generated rules list -->

## Inspiration

- Shoutout to [`unicorn/expiring-todo-comments`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/expiring-todo-comments.md) for showing me how to build my first ESLint rule.
