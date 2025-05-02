// src/userWorker.ts

// Only configure MonacoEnvironment in browser-like environments (where 'self' and 'document' exist)
// 'self' is used by web workers, 'document' helps ensure it's not a basic Node.js environment.
if (typeof self !== 'undefined' && typeof self.document !== 'undefined') {
  // Ensure MonacoEnvironment is defined globally on self/window only once
  if (typeof self.MonacoEnvironment === 'undefined') {
    self.MonacoEnvironment = {
      getWorkerUrl: function (_moduleId: any, label: string) {
        // This uses Vite's syntax for bundling workers.
        // Adjust paths/logic if using a different bundler.
        if (label === 'json') {
          return new URL('monaco-editor/esm/vs/language/json/json.worker?worker', import.meta.url).href;
        }
        // Add cases for other language workers if you use them (e.g., 'css', 'html', 'typescript')
        // if (label === 'css') {
        //   return new URL('monaco-editor/esm/vs/language/css/css.worker?worker', import.meta.url).href;
        // }
        return new URL('monaco-editor/esm/vs/editor/editor.worker?worker', import.meta.url).href;
      },
    };
  }
}
// No else block needed - in Node.js (bddgen), this file will effectively do nothing.

// Export an empty object if required by imports, otherwise can be removed if not needed.
export {};