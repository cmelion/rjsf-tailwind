// src/components/form-style-toggle.tsx
import { useFormStyle } from "./form-style-provider"

export function FormStyleToggle() {
  const { formStyle, setFormStyle } = useFormStyle()

  return (
    <button
      onClick={() => setFormStyle(formStyle === "default" ? "indigo-rounded" : "default")}
      className="rounded bg-primary/90 px-3 py-1 text-sm text-primary-foreground hover:bg-primary"
    >
      {formStyle === "default" ? "Set to Indigo Rounded" : "Set to Default Style"}
    </button>
  )
}