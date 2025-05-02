// src/components/tests/mocks/monaco-editor.mock.ts
/**
 * Monaco Editor Mock for Vitest
 *
 * This mock addresses several issues that occur when testing components that use Monaco Editor:
 *
 * 1. Monaco Editor dynamically loads workers and services using a complex module structure
 * 2. These workers use the `blob:` protocol which is incompatible with JSDOM test environment
 * 3. Monaco's web workers and dynamic imports cause race conditions during tests
 * 4. The editor attempts to register service workers that fail in the test environment
 *
 * We use this mock along with the module aliases in vitest.workspace.mts to intercept
 * Monaco imports and provide a minimal implementation with Jest spies for testing.
 */
const monaco = {
  editor: {
    create: vi.fn(() => ({
      getValue: vi.fn(() => "{}"),
      setValue: vi.fn(),
      onDidChangeModelContent: vi.fn(() => ({ dispose: vi.fn() })),
      dispose: vi.fn()
    })),
    IEditorOptions: {}
  },
  languages: {
    typescript: {
      typescriptDefaults: {
        setEagerModelSync: vi.fn()
      }
    },
    json: {}
  }
};

// Export both as default AND named exports for compatibility with different import styles
export default monaco;
export const editor = monaco.editor;
export const languages = monaco.languages;