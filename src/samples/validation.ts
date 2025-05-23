// src/samples/validation.ts
export default {
  schema: {
    title: 'Custom validation',
    description: 'This form defines custom validation rules checking that the two passwords match.',
    type: 'object',
    properties: {
      pass1: {
        title: 'Password',
        type: 'string',
        minLength: 3,
      },
      pass2: {
        title: 'Repeat password',
        type: 'string',
        minLength: 3,
      },
      age: {
        title: 'Age',
        type: 'number',
        minimum: 18,
      },
    },
  },
  uiSchema: {
    pass1: { 'ui:widget': 'password' },
    pass2: { 'ui:widget': 'password' },
  },
  formData: {},
  validate: 'validatePassword',
  transformErrors: 'ageErrorTransformer'
};
