
export default {
  schema: {
    title: 'Location',
    type: 'object',
    anyOf: [
      {
        title: 'City',
        properties: {
          city: {
            type: 'string',
          },
        },
        required: ['city'],
      },
      {
        title: 'Coordinates',
        properties: {
          lat: {
            type: 'number',
          },
          lon: {
            type: 'number',
          },
        },
        required: ['lat', 'lon'],
      },
    ],
  },
  uiSchema: {
    'ui:field': 'UiField',
  },
  formData: {},
};
