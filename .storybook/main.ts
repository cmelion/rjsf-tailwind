import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "staticDirs": ['../public'], // Keep existing static dirs
  "viteFinal": async (config) => {
    // Add Monaco Editor worker configuration
    config.worker = {
      format: 'es',
    };

    // Ensure Monaco paths are correctly set
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api',
    };

    return config;
  }
};

export default config;