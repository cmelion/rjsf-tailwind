import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { useEffect, useRef, useState } from "react"
import "../userWorker"

type EditorProps = {
  editorId: string
  jsonData: object
  onChange?: (newValue: string) => void
  debounceTime?: number
}

export default function JsonEditor({
                                     editorId,
                                     jsonData,
                                     onChange,
                                     debounceTime = 300
                                   }: EditorProps) {
  const editorRef = useRef(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const skipUpdateRef = useRef(false)
  const debounceTimerRef = useRef<number | null>(null)

  // Format JSON with indentation
  const jsonDataString = JSON.stringify(jsonData, null, 2)

  // Initialize the editor once
  useEffect(() => {
    if (!editorId || editorRef.current) return

    // @ts-expect-error - monaco-editor does not accept null refs
    editorRef.current = monaco.editor.create(
      // @ts-expect-error - monaco-editor does not accept null refs
      document.getElementById(editorId),
      {
        value: jsonDataString,
        language: "json",
        theme: "vs-dark",
        readOnly: false,
        automaticLayout: true,
        wordWrap: true,
      }
    )

    setIsEditorReady(true)

    // Cleanup when component unmounts
    return () => {
      if (editorRef.current) {
        // @ts-expect-error - monaco-editor type definitions are incomplete
        editorRef.current.dispose()
        editorRef.current = null
      }
    }
  }, [editorId]) // Only depends on editorId

  // Handle editor changes with debouncing
  useEffect(() => {
    if (!isEditorReady || !onChange || !editorRef.current) return

    // @ts-expect-error - monaco-editor type definitions are incomplete
    const disposable = editorRef.current.onDidChangeModelContent(() => {
      if (skipUpdateRef.current) {
        skipUpdateRef.current = false
        return
      }

      // Clear any existing timer
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current)
      }

      // Set a new timer to delay the update
      debounceTimerRef.current = window.setTimeout(() => {
        // @ts-expect-error - monaco-editor type definitions are incomplete
        const value = editorRef.current?.getValue()
        if (value !== undefined) {
          onChange(value)
        }
        debounceTimerRef.current = null
      }, debounceTime)
    })

    return () => {
      disposable.dispose()
      // Clear any pending timeout on cleanup
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current)
      }
    }
  }, [isEditorReady, onChange, debounceTime])

  // Update editor content when jsonData changes from outside
  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return

    // @ts-expect-error - monaco-editor type definitions are incomplete
    const currentValue = editorRef.current.getValue()

    // Only update if content is different
    if (currentValue !== jsonDataString) {
      skipUpdateRef.current = true // Prevent onChange from firing for this update
      // @ts-expect-error - monaco-editor type definitions are incomplete
      editorRef.current.setValue(jsonDataString)
    }
  }, [jsonDataString, isEditorReady])

  return <div id={editorId} style={{ flex: 1, overflow: "auto" }} />
}