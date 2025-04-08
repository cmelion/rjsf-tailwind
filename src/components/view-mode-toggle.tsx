// src/components/view-mode-toggle.tsx
import { useViewMode } from "./view-mode-provider"

export function ViewModeToggle() {
  const { viewMode, toggleViewMode } = useViewMode()

  return (
    <button
      onClick={toggleViewMode}
      className="rounded bg-primary/90 px-3 py-1 text-sm text-primary-foreground hover:bg-primary"
    >
      {viewMode === "form" ? "Switch to Table View" : "Switch to Form View"}
    </button>
  )
}