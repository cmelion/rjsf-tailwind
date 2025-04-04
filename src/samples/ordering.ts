export default {
  schema: {
    title: 'A registration form',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      password: {
        type: 'string',
        title: 'Password',
      },
      lastName: {
        type: 'string',
        title: 'Last name',
      },
      bio: {
        type: 'string',
        title: 'Bio',
      },
      firstName: {
        type: 'string',
        title: 'First name',
      },
      age: {
        type: 'integer',
        title: 'Age',
      },
    },
  },
  uiSchema: {
    'ui:order': ['lastName', 'firstName', '*', 'password'],
    'ui:gridLayout': true, // Enable our new grid layout

    firstName: {
      'ui:widget': 'text',
      'tw:width': 'half',  // Takes half the width
    },
    lastName: {
      'ui:widget': 'text',
      'tw:width': 'half',  // Takes half the width
    },

    // Other fields
    age: {
      'ui:widget': 'updown',
      'tw:width': 'half',
    },
    bio: {
      'ui:widget': 'textarea',
      'tw:width': 'full',
    },
    password: {
      'ui:widget': 'password',
      'tw:width': 'half',
    },
  },
  formData: {
    firstName: 'Chuck',
    lastName: 'Norris',
    age: 75,
    bio: 'Roundhouse kicking asses since 1940',
    password: 'noneed',
  },
};
