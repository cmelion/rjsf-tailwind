import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { useEffect, useRef } from "react"
import "../../userWorker.ts"

type EditorProps = {
  editorId: string
  jsonData?: object
  onChange?: (newValue: string) => void
}

export default function JsonEditor({
                                     editorId,
                                     jsonData = {}, // Provide default empty object
                                     onChange,
                                   }: EditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  useEffect(() => {
    // Create editor if not already initialized
    if (!editorRef.current) {
      const editorElement = document.getElementById(editorId)
      if (editorElement) {
        editorRef.current = monaco.editor.create(editorElement, {
          value: JSON.stringify(jsonData, null, 2),
          language: "json",
          theme: "vs-dark",
        })
      }
    }

    // make it easier to work with the editor instance within the useEffect hook
    const editor = editorRef.current

    // If the editor failed to initialize, exit early
    if (!editor) return

    // Update editor content when jsonData changes
    const currentValue = editor.getValue()
    const newValue = JSON.stringify(jsonData, null, 2)
    if (currentValue !== newValue) {
      editor.setValue(newValue)
    }

    // Subscribe to content changes
    const disposable = editor.onDidChangeModelContent(() => {
      onChange?.(editor.getValue())
    })

    // Cleanup function to dispose of resources when the component unmounts or dependencies change
    return () => {
      disposable.dispose()
      editor.dispose()
      editorRef.current = undefined
    }
  }, [editorId, jsonData, onChange])

  return <div id={editorId} style={{ flex: 1, overflow: "auto" }} />
}