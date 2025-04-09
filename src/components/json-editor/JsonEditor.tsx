import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { useEffect, useRef } from "react"
import "../../userWorker.ts"

type EditorProps = {
    editorId: string
    jsonData?: object
    onChange?: (newValue: string) => void
    editorOptions?: monaco.editor.IEditorOptions
}

export default function JsonEditor({
                                       editorId,
                                       jsonData = {},
                                       onChange,
                                       editorOptions = {},
                                   }: EditorProps) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

    useEffect(() => {
        if (!editorRef.current) {
            const editorElement = document.getElementById(editorId)
            if (editorElement) {
                editorRef.current = monaco.editor.create(editorElement, {
                    value: JSON.stringify(jsonData, null, 2),
                    language: "json",
                    theme: "vs-dark",
                    ...editorOptions,
                })
            }
        }

        const editor = editorRef.current
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

        return () => {
            disposable.dispose()
            editor.dispose()
            editorRef.current = undefined
        }
    }, [editorId, jsonData, onChange, editorOptions])

    return <div id={editorId} style={{ flex: 1, overflow: "auto" }} />
}