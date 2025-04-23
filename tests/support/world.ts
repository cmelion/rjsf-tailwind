
// tests/support/world.ts
import { World, setWorldConstructor } from '@cucumber/cucumber';

// Define a simpler custom world that just adds our properties
export class CustomWorldClass extends World {
  schema?: any;
  tableData?: Record<string, string>[];

  // Add the index signature
  [key: string]: any;
}

// Register the custom world class
setWorldConstructor(CustomWorldClass);

// Export the type for use in step definitions
export type CustomWorld = CustomWorldClass;