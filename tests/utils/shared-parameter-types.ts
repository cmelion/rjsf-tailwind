// tests/utils/shared-parameter-types.ts

export const sharedParameterTypes = [
  {
    name: "path",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "story",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "text",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "name",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "className",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "title",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "label",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "attribute",
    regexp: /([^"]*)/,
    transformer: (string: string) => string,
  },
  {
    name: "method",
    regexp: /(GET|POST|PUT|DELETE)/,
    transformer: (string: string) => string,
  },
  {
    name: "radioOrCheckbox",
    regexp: /(radio button|checkbox)/,
    transformer: (string: string) => string,
  },
  {
    name: "ariaLabel",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "role",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "tableName",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  },
  {
    name: "tableRole",
    regexp: /"?(grid|table)"?/,
    transformer: (string: string) => string.replace(/"/g, ""),
  },
]

// This is a workaround to define parameter types for Webstorm editor
const defineParameterType = (
  _parameter: {
    name: string;
    regexp: RegExp;
    transformer: ((quotedString: string) => string) | ((string: string) => string);
  }) => {}

// We want the editor to recognize the parameter types in the same way Playwright-BDD and QuickPickle do.
// Unfortunately, Webstorm does not support defining parameter types in a loop.
defineParameterType(  {
  name: 'tableName',
  regexp: /"([^"]*)"/,
  transformer: (quotedString: string) => quotedString,
});
defineParameterType({
  name: 'tableRole',
  regexp: /"?(grid|table)"?/,
  transformer: (string: string) => string.replace(/"/g, ''),
});
defineParameterType({
    name: "path",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "story",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "text",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "name",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "className",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "title",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "label",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "attribute",
    regexp: /([^"]*)/,
    transformer: (string: string) => string,
  });
defineParameterType({
    name: "method",
    regexp: /(GET|POST|PUT|DELETE)/,
    transformer: (string: string) => string,
  });
defineParameterType({
    name: "radioOrCheckbox",
    regexp: /(radio button|checkbox)/,
    transformer: (string: string) => string,
  });
defineParameterType({
    name: "ariaLabel",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
defineParameterType({
    name: "role",
    regexp: /"([^"]*)"/,
    transformer: (quotedString: string) => quotedString,
  });
