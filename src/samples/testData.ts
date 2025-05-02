// src/samples/testData.ts
export default {
  schema: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: {
        type: 'string',
        title: 'Name',
      },
      email: {
        type: 'string',
        title: 'Email',
        format: 'email',
      },
      age: {
        type: 'integer',
        title: 'Age',
        minimum: 0,
      },
      isActive: {
        type: 'boolean',
        title: 'Active',
      },
      role: {
        type: 'string',
        title: 'Role',
        enum: ['admin', 'user', 'guest'],
      },
      tags: {
        type: 'array',
        title: 'Tags',
        items: {
          type: 'string',
        },
      },
    },
  },
  uiSchema: {
    'ui:order': ['name', 'email', 'age', 'isActive', 'role', 'preferences', 'tags'],
    age: {
      'ui:widget': 'updown',
    },
    role: {
      'ui:widget': 'select',
    },
  },
  formData: [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 32,
      isActive: true,
      role: 'admin',
      tags: ['developer', 'react'],
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      age: 27,
      isActive: true,
      role: 'user',
      tags: ['designer', 'ui'],
    },
    {
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      age: 45,
      isActive: false,
      role: 'guest',
      tags: ['guest'],
    },
  ]
};