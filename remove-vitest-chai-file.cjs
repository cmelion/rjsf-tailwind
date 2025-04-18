/* eslint-disable */
// This script removes the problematic file causing type issues in step definitions.
// For context see: https://github.com/vitest-dev/vitest/issues/6241#issuecomment-2257734130

const fs = require('fs');
const path = require('path');

// Construct the absolute path to the file in node_modules
const problematicFilePath = path.join(
  __dirname,
  'node_modules',
  '@vitest',
  'expect',
  'dist',
  'chai.d.cts'
);

// Remove the file if it exists
fs.unlink(problematicFilePath, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log(`File not found, nothing to remove: ${problematicFilePath}`);
    } else {
      console.error(`Error removing file: ${problematicFilePath}`, err);
      process.exit(1);
    }
  } else {
    console.log(`Successfully removed file: ${problematicFilePath}`);
  }
});