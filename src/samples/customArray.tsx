export default {
  schema: {
    title: 'Custom array of strings',
    type: 'array',
    items: {
      type: 'string',
    },
  },
  formData: ['react', 'jsonschema', 'form'],
  uiSchema: {
    'ui:ArrayFieldTemplate': 'ArrayFieldTemplate'
  }
};
