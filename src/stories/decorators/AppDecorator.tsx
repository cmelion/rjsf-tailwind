// src/stories/decorators/AppDecorator.tsx
import React from 'react';
import { ThemeProvider } from "@/components/providers/theme/theme-provider.tsx";
import { MemoryRouter as Router } from 'react-router-dom';

interface StorybookAppDecoratorProps {
  children: React.ReactNode;
}

export const StorybookAppDecorator: React.FC<StorybookAppDecoratorProps> = ({ children }) => {
  // Remove the basename for static builds to avoid path resolution issues
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router initialEntries={['/']}>
        {children}
      </Router>
    </ThemeProvider>
  );
};