// src/App.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { JSONSchema7 } from 'json-schema';
import App from './App';
import { StorybookAppDecorator } from './stories/decorators/AppDecorator';
import { useStore } from './store'; // Import the Zustand store
import testData from './samples/testData';

// --- Define or import your initial data to support test environments ---
// Using the data from TailwindTable.stories.tsx as an example
const initialSchema = testData.schema as unknown as JSONSchema7;

const initialUiSchema = testData.uiSchema;

const initialFormData = testData.formData;
// --- End of initial data ---

const meta: Meta<typeof App> = {
  title: 'Pages/App',
  component: App,
  decorators: [
    (Story) => (
      <StorybookAppDecorator>
        <Story />
      </StorybookAppDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof App>;

export const Default: Story = {
  render: () => {
    // Set only the necessary initial state for the story
    useStore.setState({
      schema: initialSchema,
      uiSchema: initialUiSchema,
      formData: initialFormData,
      // Keep loading false and error null to represent a stable initial state
      loading: false,
      error: null,
      // Remove label and availableSamples to avoid interfering with store logic
      // label: 'DefaultAppData', // Removed
      // availableSamples: ['DefaultAppData'], // Removed
    });

    // Render the App component, which will now use the initial state
    // while managing its own samples list.
    return <App />;
  },
};