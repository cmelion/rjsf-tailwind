// vitest.workspace.mts
import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { quickpickle } from "quickpickle";
import * as path from 'path';

// Common configuration that will be shared/extended
const baseConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
      // Monaco editor mocks
      "monaco-editor": path.resolve(__dirname, "./src/components/tests/mocks/monaco-editor.mock.ts"),
      "monaco-editor/esm/vs/editor/editor.api": path.resolve(__dirname, "./src/components/tests/mocks/monaco-editor.mock.ts"),
      // Worker mocks
      "monaco-editor/esm/vs/editor/editor.worker?worker": path.resolve(__dirname, "./src/components/tests/mocks/monaco-workers.mock.ts"),
      "monaco-editor/esm/vs/language/json/json.worker?worker": path.resolve(__dirname, "./src/components/tests/mocks/monaco-workers.mock.ts"),
      // Important: Mock the userWorker.ts file directly
      "src/userWorker.ts": path.resolve(__dirname, "./src/components/tests/mocks/userWorker.mock.ts"),
      // Also add the relative path version that might be used in imports
      "../../userWorker.ts": path.resolve(__dirname, "./src/components/tests/mocks/userWorker.mock.ts"),
      // Mock the worker file for MSW
      "msw/browser": path.resolve(__dirname, "node_modules/msw/lib/browser/index.js"),
    },
  },
};

// Define the test configuration for the 'components' project
const componentsTestConfig = {
  name: 'components',
  environment: 'jsdom',
  globals: true,
  include: ['./src/components/**/*.feature'],
  // We have to use the index file to load all step definitions - update this if you add more
  setupFiles: [
    'src/components/tests/setupTests.ts',
    'src/components/tests/index.ts'
  ],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    reportsDirectory: './coverage/components',
    // Only include src files in coverage reports
    include: ['src/**'],
    exclude: [
      'src/main.tsx',
      'src/userWorker.ts',
      'src/mocks/browser.ts',
      'src/components/tests/mocks/monaco-workers.mock.ts',
      'src/components/tests/step-definitions/tailwind-form.steps',
    ]
  },
};

export default defineWorkspace([
  {
    ...baseConfig,
    plugins: [...(baseConfig.plugins || []), quickpickle()],
    test: componentsTestConfig,
  },
]);