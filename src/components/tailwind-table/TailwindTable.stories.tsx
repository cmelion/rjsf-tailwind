// src/components/tailwind-table/TailwindTable.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { JSONSchema7 } from 'json-schema';
import TailwindTable from './TailwindTable';
import testData from '@/samples/testData';

const meta: Meta<typeof TailwindTable> = {
  title: 'Components/TailwindTable',
  component: TailwindTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TailwindTable>;

// Sample schema representing a user profile
const userSchema = testData.schema as JSONSchema7;

// Sample ui schema to customize form appearance
const userUiSchema = testData.uiSchema;

// Sample data
const sampleUsers = testData.formData;

export const Default: Story = {
  args: {
    schema: userSchema,
    uiSchema: userUiSchema,
    formData: sampleUsers,
    onChange: (_data) => console.log('Data changed:' /*, data */),
  },
};

export const EmptyTable: Story = {
  args: {
    ...Default.args,
    formData: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the table appears when there are no records.',
      },
    },
  },
};

export const SingleColumn: Story = {
  args: {
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
      },
    },
    formData: sampleUsers.map(user => ({ name: user.name })),
    onChange: (data) => console.log('Data changed:', data),
  },
};

export const ManyRows: Story = {
  args: {
    ...Default.args,
    formData: Array(20).fill(0).map((_, i) => ({
      ...sampleUsers[i % sampleUsers.length],
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })),
  },
};

export const WithDifferentDataTypes: Story = {
  args: {
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string', title: 'Text Value' },
        number: { type: 'number', title: 'Number Value' },
        boolean: { type: 'boolean', title: 'Boolean Value' },
        object: { type: 'object', title: 'Object Value' },
        array: { type: 'array', title: 'Array Value' },
      },
    },
    formData: [
      {
        text: 'Simple text',
        number: 42.5,
        boolean: true,
        object: { key1: 'value1', key2: 'value2' },
        array: ['item1', 'item2', 'item3'],
      },
      {
        text: 'Another text',
        number: 100,
        boolean: false,
        object: { foo: 'bar', baz: 'qux' },
        array: [1, 2, 3, 4, 5],
      },
    ],
    onChange: (data) => console.log('Data changed:', data),
  },
};