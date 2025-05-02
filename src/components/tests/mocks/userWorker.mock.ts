// src/components/tests/mocks/userWorker.mock.ts
// Empty mock implementation for userWorker.ts
// This prevents monaco worker initialization issues

// Set up MonacoEnvironment for tests
if (typeof window !== 'undefined') {
  window.MonacoEnvironment = {
    getWorkerUrl: () => ''
  };
}

export default {};