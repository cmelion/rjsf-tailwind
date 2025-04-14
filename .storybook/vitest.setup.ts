// .storybook/vitest.setup.ts
import { expect, vi } from 'vitest';

// Make test utilities available globally
globalThis.expect = expect;
globalThis.vi = vi;

// If needed, add explicit type declarations
declare global {
  namespace Vi {
    interface Assertion {
      toBeGreaterThan(expected: number): void;
      // Add other matchers if needed
    }
  }
}