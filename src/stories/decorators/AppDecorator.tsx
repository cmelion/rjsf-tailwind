// src/stories/decorators/AppDecorator.tsx
import React from "react"
import { MemoryRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@/components/providers/theme/theme-provider.tsx"

interface StorybookAppDecoratorProps {
  children: React.ReactNode
}

export const StorybookAppDecorator: React.FC<StorybookAppDecoratorProps> = ({
  children,
}) => {
  // Remove the basename for static builds to avoid path resolution issues
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router
        initialEntries={["/"]}
        future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
      >
        {children}
      </Router>
    </ThemeProvider>
  )
}
