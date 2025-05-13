// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';
import * as path from 'path';

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
  "staticDirs": ['../public'],
  "viteFinal": async (config) => {
    // Add Monaco Editor worker configuration
    config.worker = {
      format: 'es',
    };

    // Add Monaco module to optimizeDeps
    config.optimizeDeps = {
      ...(config.optimizeDeps || {}),
      include: [...(config.optimizeDeps?.include || []), 'monaco-editor'],
    };

    // Ensure Monaco paths are correctly set
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'monaco-editor': 'monaco-editor',
      // Worker file aliases - these are crucial
      'monaco-editor/esm/vs/editor/editor.worker?worker': path.resolve(
        __dirname,
        '../node_modules/monaco-editor/esm/vs/editor/editor.worker.js'
      ),
      'monaco-editor/esm/vs/language/json/json.worker?worker': path.resolve(
        __dirname,
        '../node_modules/monaco-editor/esm/vs/language/json/json.worker.js'
      ),
    };

    return config;
  }
};

export default config;