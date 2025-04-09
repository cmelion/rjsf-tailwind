// src/components/form-style-toggle.tsx
import { useFormStyle } from "./form-style-provider.tsx"

export function FormStyleToggle() {
  const { formStyle, setFormStyle } = useFormStyle()

  return (
    <button
      onClick={() => setFormStyle(formStyle === "default" ? "indigo-rounded" : "default")}
      className="default-button"
    >
      {formStyle === "default" ? "Set to Indigo Rounded" : "Set to Default Style"}
    </button>
  )
}