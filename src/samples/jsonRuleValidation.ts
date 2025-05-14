// src/samples/jsonRuleValidation.ts
export default {
  schema: {
    title: "JSON rule validation",
    description:
      "This form defines custom validation rules checking that the two passwords match.",
    type: "object",
    properties: {
      pass1: {
        title: "Password",
        type: "string",
        minLength: 3,
      },
      pass2: {
        title: "Repeat password",
        type: "string",
        minLength: 3,
      },
      age: {
        title: "Age",
        type: "number",
        minimum: 18,
      },
    },
  },
  uiSchema: {
    pass1: { "ui:widget": "password" },
    pass2: { "ui:widget": "password" },
  },
  formData: {},
  validateRules: [
    {
      conditions: {
        pass2: { equal: "pass1" }, // Use the field directly as a key, with proper reference format
      },
      event: {
        type: "passwordMatch",
        params: {
          message: "Passwords don't match.",
          field: "pass2",
        },
      },
    },
    {
      conditions: {
        age: { greaterThanEqual: 18 },
      },
      event: {
        type: "ageCheck",
        params: {
          message: "You need to be 18 because of some legal thing",
          field: "age",
        },
      },
    },
    {
      conditions: {
        age: { lessThanEqual: 55 },
      },
      event: {
        type: "ageCheck",
        params: {
          message: "I see an age discrimination lawsuit headed your way.",
          field: "age",
        },
      },
    },
  ],
}
