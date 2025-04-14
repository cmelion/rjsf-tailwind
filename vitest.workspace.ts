// vitest.workspace.ts
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
    },
  },
};

export default defineWorkspace([
  {
    // Extend the base config and add component-specific plugins
    ...baseConfig,
    plugins: [...(baseConfig.plugins || []), quickpickle()],
    test: {
      name: 'components',
      environment: 'jsdom',
      globals: true,
      include: ['./src/components/**/*.feature'],
      setupFiles: ['./src/components/tests/component.steps'],
    },
  },
]);