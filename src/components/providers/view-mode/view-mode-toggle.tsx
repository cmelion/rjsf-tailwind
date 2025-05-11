// src/components/view-theme-toggle.tsx
import { useViewMode } from "./view-mode-provider.tsx"

export function ViewModeToggle() {
  const { viewMode, toggleViewMode } = useViewMode()

  return (
    <button
      onClick={toggleViewMode}
      className="default-button"
    >
      {viewMode === "form" ? "Switch to Table View" : "Switch to form View"}
    </button>
  )
}