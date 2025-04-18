
// vitest.config.ts

// When using a workspace configuration (via defineWorkspace),
// you export an array of configurations. Some integrations—like
// the IntelliJ/Vitest reporter—may not handle an array export
//
// To work around this, we can create a dedicated configuration
// file that exports only the configuration we want to debug

import workspace from './vitest.workspace';

// Pick the "components" configuration from the workspace array.
// TypeScript is complaining because it doesn't know the exact type of workspace items
// We'll cast it to make TypeScript happy
const componentsConfig = workspace.find(cfg =>
  typeof cfg === 'object' && cfg !== null && 'test' in cfg &&
  typeof cfg.test === 'object' && cfg.test !== null &&
  'name' in cfg.test && cfg.test.name === 'components'
);

// Use the components config or fall back to the first config
export default componentsConfig || workspace[0];