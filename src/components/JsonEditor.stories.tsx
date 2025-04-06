// src/components/JsonEditor.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import JsonEditor from './json-editor';

const meta: Meta<typeof JsonEditor> = {
  title: 'Components/JsonEditor',
  component: JsonEditor,
  argTypes: {
    editorId: {
      type: 'string',
      description: 'The ID of the editor element.',
    },
    jsonData: {
      control: 'object',
      description: 'The JSON data to display in the editor.',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback function when the editor content changes.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JsonEditor>;

const ResponsiveContainer = ({ heading, children }: any) => {
  return (
    <div className="flex items-center justify-center [&>div]:w-full h-full">
      <div className="overflow-hidden bg-background sm:rounded-t-lg w-full h-full">
        <div className="flex items-center justify-between border bg-background px-4 py-5 sm:rounded-t-lg sm:px-6">
          <h3 className="text-base font-semibold leading-6">{heading}</h3>
        </div>
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    editorId: 'json-editor',
    jsonData: {
      name: 'John Doe',
      age: 30,
      city: 'New York',
    },
  },
  render: (args) => (
    <div style={{ height: '50vh' }}>
      <ResponsiveContainer heading="JSON Editor">
        <div className="flex h-full flex-col">
          <JsonEditor {...args} />
        </div>
      </ResponsiveContainer>
    </div>
  ),
};

export const Empty: Story = {
  args: {
    editorId: 'json-editor-empty',
    jsonData: {},
  },
  render: (args) => (
    <div style={{ height: '50vh' }}>
      <ResponsiveContainer heading="JSON Editor (Empty)">
        <div className="flex h-full flex-col">
          <JsonEditor {...args} />
        </div>
      </ResponsiveContainer>
    </div>
  ),
};
