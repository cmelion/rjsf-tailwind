// src/components/view-mode-provider.tsx
import { createContext, useContext, useState, ReactNode } from "react"

type ViewMode = "form" | "table"

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("form")

  const toggleViewMode = () => {
    setViewMode(viewMode === "form" ? "table" : "form")
  }

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const context = useContext(ViewModeContext)
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider")
  }
  return context
}