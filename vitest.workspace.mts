// vitest.workspace.mts
import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { quickpickle } from "quickpickle";
import path from 'path';

// Common configuration that will be shared/extended
const baseConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
};

// Define the test configuration for the 'components' project
// Remove the explicit : ProjectConfig type assertion
const componentsTestConfig = {
  name: 'components',
  environment: 'jsdom',
  globals: true,
  include: ['./src/components/**/*.feature'],
  setupFiles: ['src/components/tests/index.ts'],
  // Place coverage configuration here
  coverage: {
    provider: 'v8', // or 'istanbul'
    // Ensure 'html' is listed
    reporter: ['text', 'json', 'html'],
    // Explicitly set the output directory for this project's coverage
    reportsDirectory: './coverage/components',
  },
};

export default defineWorkspace([
  {
    // Extend the base config and add component-specific plugins
    ...baseConfig,
    plugins: [...(baseConfig.plugins || []), quickpickle()],
    // Assign the test configuration
    test: componentsTestConfig,
  },
  // Add other projects here if needed
]);