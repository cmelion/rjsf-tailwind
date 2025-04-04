// src/App.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import App from './App';
import { StorybookAppDecorator } from './stories/decorators/AppDecorator';

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
  render: () => (
    <App />
  ),
};