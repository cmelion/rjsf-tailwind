// tests/utils/register-parameter-types.ts
import { sharedParameterTypes } from './shared-parameter-types';
import { defineParameterType as playwrightDefineParameterType } from 'playwright-bdd';
import { defineParameterType as quickPickleDefineParameterType } from 'quickpickle';

// Playwright BDD adapter
export function registerPlaywrightBddParameterTypes(): void {
  sharedParameterTypes.forEach(({ name, regexp, transformer }) => {
    playwrightDefineParameterType({
      name,
      regexp,
      transformer
    });
  });
}

// QuickPickle adapter
export function registerQuickPickleParameterTypes(): void {
  sharedParameterTypes.forEach(({ name, regexp, transformer }) => {
    quickPickleDefineParameterType({
      name,
      regexp,
      transformer
    });
  });
}

// Cucumber adapter for editor
// Unfortunately, Cucumber.js in Webstorm does not support defining parameter types in a loop.
// See shared-parameter-types.ts for hard-coded implementation of the parameter types.
//
// You can add new parameter types to the array in the shared-parameter-types.ts file.
// run yarn or npm install afterwards to update the parameter static types available in Webstorm's Cucumber integrations.
// Alternatively you could add a watcher to the shared-parameter-types.ts file to automatically run the script when the file changes.
//
// export function registerCucumberParameterTypes(): void {
//   sharedParameterTypes.forEach(({ name, regexp, transformer }) => {
//     console.log(`Registering parameter type: ${name}`);
//     cucumberDefineParameterType({
//       name,
//       regexp,
//       transformer
//     });
//   });
// }

