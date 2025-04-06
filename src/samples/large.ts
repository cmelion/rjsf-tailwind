export default {
  schema: {
    definitions: {
      largeEnum: {
        type: 'string',
        enumSize: 100  // Marker to generate 100 options
      },
    },
    title: 'A rather large form',
    type: 'object',
    properties: {
      string: {
        type: 'string',
        title: 'Some string',
      },
      choice1: { $ref: '#/definitions/largeEnum' },
      choice2: { $ref: '#/definitions/largeEnum' },
      // Other choices...
    },
  },
  uiSchema: {
    choice1: {
      'ui:placeholder': 'Choose one',
    },
  },
  formData: {},
};