// src/components/json-editor/JsonEditor.tsx
import { useEffect, useRef, useState } from "react";

// Define types without direct Monaco dependency
type EditorProps = {
  editorId: string;
  jsonData?: object;
  onChange?: (newValue: string) => void;
  editorOptions?: any; // Changed from monaco.editor.IEditorOptions
};

export default function JsonEditor({
                                     editorId,
                                     jsonData = {},
                                     onChange,
                                     editorOptions = {},
                                   }: EditorProps) {
  const editorRef = useRef<any>(); // Changed from monaco.editor.IStandaloneCodeEditor
  const [monaco, setMonaco] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);

  // Dynamically load Monaco/mocks and worker configuration
  useEffect(() => {
    let isMounted = true;

    const loadMonaco = async () => {
      try {
        // Dynamically import userWorker first to set up MonacoEnvironment
        await import("../../userWorker.ts");
        // Then import Monaco editor
        const monacoModule = await import("monaco-editor");

        if (!isMounted) return;

        // Check module structure and set monaco state
        if (monacoModule && monacoModule.default && monacoModule.default.editor) {
          setMonaco(monacoModule.default);
        } else if (monacoModule && monacoModule.editor) {
          setMonaco(monacoModule);
        } else {
          setError(true);
          console.error("Monaco module structure unexpected:", monacoModule);
        }
      } catch (err) {
        if (isMounted) setError(true);
        console.error("Failed to load Monaco editor or worker config:", err);
      }
    };

    const loadMocks = async () => {
      try {
        // Import mock worker setup first
        await import("../tests/mocks/userWorker.mock.ts");
        // Then import the mock editor implementation
        const monacoMockModule = await import("../tests/mocks/monaco-editor.mock.ts");

        if (!isMounted) return;

        // Set monaco state with the mock object
        if (monacoMockModule && monacoMockModule.default) {
          setMonaco(monacoMockModule.default);
        } else {
          // Fallback if default export isn't found (shouldn't happen with current mock)
          setMonaco(monacoMockModule);
        }
        // Do not set error state when mocks are loaded successfully
      } catch (err) {
        if (isMounted) setError(true); // Set error if mocks fail to load
        console.error("Failed to load Monaco mocks:", err);
      }
    };

    // Check if in a browser-like environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      loadMonaco();
    } else {
      // If not in a browser env (like bddgen's Node process), load mocks.
      loadMocks();
    }

    return () => {
      isMounted = false;
    };
  }, []); // Dependency array is correct as empty

  // Editor initialization effect (remains the same)
  useEffect(() => {
    // Ensure monaco is loaded AND we are in a browser environment OR mocks are loaded
    // The check for window/document might be redundant if mocks handle non-browser correctly,
    // but it adds safety. The main gate is now `!monaco || error`.
    if (!monaco || error) return;

    // Check if we are in a non-browser env where mocks are used; skip DOM manipulation
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

    let editorInstance: any = editorRef.current;

    if (!editorInstance && isBrowser) { // Only try to create editor in browser
      const editorElement = document.getElementById(editorId);
      if (editorElement) {
        editorElement.innerHTML = ''; // Clear previous content
        editorInstance = monaco.editor.create(editorElement, {
          value: JSON.stringify(jsonData, null, 2),
          language: "json",
          theme: "vs-dark",
          automaticLayout: true,
          ...editorOptions,
        });
        editorRef.current = editorInstance;
      } else {
        console.error(`Element with id "${editorId}" not found.`);
        return;
      }
    } else if (!isBrowser && !editorInstance) {
      // If in non-browser (mocks loaded), create mock instance representation
      // This assumes the mock's create function returns the expected structure
      editorInstance = monaco.editor.create();
      editorRef.current = editorInstance;
    }


    // Update editor content when jsonData changes (works for both real and mock editor)
    if (editorInstance) {
      const currentValue = editorInstance.getValue();
      const newValue = JSON.stringify(jsonData, null, 2);
      if (currentValue !== newValue) {
        // Use setValue for simplicity with mocks, or adapt mock if executeEdits is needed
        editorInstance.setValue(newValue);
        // If using executeEdits, ensure mock supports it or add conditional logic
        /*
        if (isBrowser) {
            editorInstance.executeEdits('updateJsonData', [{ range: editorInstance.getModel().getFullModelRange(), text: newValue }]);
        } else {
            editorInstance.setValue(newValue); // Mock might just use setValue
        }
        */
      }

      // Subscribe to content changes (works for both real and mock editor)
      const disposable = editorInstance.onDidChangeModelContent(() => {
        onChange?.(editorInstance.getValue());
      });

      return () => {
        disposable.dispose();
        if (editorRef.current) {
          editorRef.current.dispose();
          editorRef.current = undefined;
        }
      };
    }
  }, [editorId, jsonData, onChange, editorOptions, monaco, error]);

  // Fallback UI when Monaco fails to load (in browser) or mocks fail
  if (error) {
    // Render textarea only if in browser, otherwise render nothing or a placeholder
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return (
        <textarea
          id={editorId}
          style={{ width: '100%', minHeight: "200px", border: '1px solid grey', fontFamily: 'monospace' }}
          value={JSON.stringify(jsonData, null, 2)}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={!onChange}
          aria-label="JSON editor fallback"
        />
      );
    } else {
      // In non-browser error state, maybe render nothing or a simple div
      return <div data-testid="editor-error-placeholder">Editor failed to load</div>;
    }
  }

  // Render container div (needed for real editor, harmless for mocks)
  // Or conditionally render based on environment if preferred
  return <div id={editorId} style={{ width: '100%', minHeight: '200px', flex: 1, overflow: "hidden" }} data-testid="json-editor-container" />;
}