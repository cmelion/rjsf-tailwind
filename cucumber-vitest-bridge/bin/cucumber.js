#!/usr/bin/env node
// CommonJS adapter for cucumber -> vitest

/* eslint-disable */
/**
 * WebStorm-Vitest-Cucumber Bridge
 *
 * This file serves as a bridge between WebStorm's Cucumber.js integration and Vitest.
 * It intercepts Cucumber.js commands from WebStorm and translates them into Vitest commands,
 * allowing us to:
 * 1. Maintain WebStorm's Cucumber.js IDE integration (feature file highlighting, gherkin support)
 * 2. Execute tests using Vitest's React component testing capabilities
 * 3. Fix debugging issues by dynamically allocating debug ports
 *
 * This file uses CommonJS module format and needs to be excluded from standard linting rules
 * as it must be compatible with WebStorm's direct execution of cucumber.js.
 */


const path = require('path');
const { execSync } = require('child_process');

// Get args and look for relevant arguments
const args = process.argv.slice(2);
let scenarioPattern = null;
let featureFilePath = null;
let reporterPath = null;

// Parse args to find the scenario name pattern and feature file
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name' && i + 1 < args.length) {
    scenarioPattern = args[i + 1];
    i++;
  } else if (args[i].endsWith('.feature')) {
    featureFilePath = args[i];
  } else if (args[i] === '--format' && i + 1 < args.length) {
    reporterPath = args[i + 1];
    i++;
  }
}

// Clean the scenario pattern if needed
const testNamePattern = scenarioPattern?.replace(/^\^/, '').replace(/\$$/, '');

// Log what we're doing
console.log('Cucumber adapter: Converting to Vitest command');
console.log(`Feature file: ${featureFilePath}`);
console.log(`Scenario pattern: ${testNamePattern}`);

// Use the current node executable path
const nodeExecutable = process.execPath; // This gets the full path to the Node.js executable
console.log(`Using Node.js executable: ${nodeExecutable}`);
const vitestScript = path.resolve(process.cwd(), 'node_modules/vitest/vitest.mjs');

// Get a random debug port to avoid conflicts
const getFreeDebugPort = () => {
  // Generate a random port between 50000-60000 to avoid conflicts
  return Math.floor(Math.random() * 10000) + 50000;
};

const debugPort = getFreeDebugPort();
console.log(`Using debug port: ${debugPort}`);

// Build the vitest command with environment variables
// This avoids direct port conflict by using a new random port
const command = [
  nodeExecutable, // Use the full path to Node.js
  `--inspect=${debugPort}`, // Use a random debug port
  vitestScript,
  'run',
  '--config', path.resolve(process.cwd(), 'vitest.config.ts'),
  '--project', 'components',
  '--poolOptions.threads.maxThreads=1',
  '--poolOptions.threads.minThreads=1',
  '--poolOptions.forks.maxForks=0',
  '--poolOptions.forks.minForks=0',
  '--poolOptions.vmThreads.maxThreads=1',
  '--poolOptions.vmThreads.minThreads=1',
  '--pool=threads',
].join(' ');

// Add the test name pattern if available
const finalCommand = testNamePattern
  ? `${command} --testNamePattern "${testNamePattern}" ${featureFilePath}`
  : `${command} ${featureFilePath}`;

console.log(`Running command: ${finalCommand}`);

try {
  // Use execSync to run the command and inherit the stdio
  execSync(finalCommand, {
    stdio: 'inherit',
    env: {
      ...process.env,
      // This lets any child processes inherit the NODE_OPTIONS, except debugging flags
      NODE_OPTIONS: (process.env.NODE_OPTIONS || '')
        .split(' ')
        .filter(opt => !opt.includes('--inspect'))
        .join(' ')
    }
  });
  process.exit(0);
} catch (error) {
  console.error('Command execution failed with error:', error.message);
  process.exit(error.status || 1);
}