// src/stories/decorators/AppDecorator.tsx
import React from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { MemoryRouter as Router } from 'react-router-dom';

interface StorybookAppDecoratorProps {
  children: React.ReactNode;
}

export const StorybookAppDecorator: React.FC<StorybookAppDecoratorProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router initialEntries={['/']} basename={import.meta.env.BASE_URL}>
        {children}
      </Router>
    </ThemeProvider>
  );
};