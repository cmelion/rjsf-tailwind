// generate-parameter-types.cjs
/* eslint-disable */
// This script ensures all custom parameter types are available via Webstorm's Cucumber integrations.
// It reads the shared-parameter-types.ts file, checks for any missing parameter types,

const fs = require('fs');
const path = require('path');

// Path to the shared-parameter-types.ts file
const paramTypesFilePath = path.join(
  __dirname,
  'tests',
  'utils',
  'shared-parameter-types.ts'
);

try {
  // Read the file
  const fileContent = fs.readFileSync(paramTypesFilePath, 'utf8');

  // Check if file exists and has content
  if (!fileContent) {
    console.error(`File is empty or doesn't exist: ${paramTypesFilePath}`);
    process.exit(1);
  }

  // Extract the already defined parameter types
  const definedTypePattern = /defineParameterType\(\s*{\s*name:\s*['"]([^'"]+)['"]/g;
  const definedTypes = new Set();
  let match;

  while ((match = definedTypePattern.exec(fileContent)) !== null) {
    definedTypes.add(match[1]);
  }

  // Extract all parameter types from the array
  const typePattern = /{\s*name:\s*["']([^"']+)["']/g;
  const allTypes = new Set();
  const typeDetails = new Map();

  while ((match = typePattern.exec(fileContent)) !== null) {
    const paramName = match[1];
    allTypes.add(paramName);

    // Get the full parameter type object
    const fullObjectPattern = new RegExp(`{\\s*name:\\s*["']${paramName}["'][^}]*}`, 'g');
    const objectMatch = fullObjectPattern.exec(fileContent);
    if (objectMatch) {
      typeDetails.set(paramName, objectMatch[0]);
    }
  }

  // Find types that need to be added
  const missingTypes = [...allTypes].filter(type => !definedTypes.has(type));

  if (missingTypes.length === 0) {
    console.log('All parameter types are already defined');
    return;
  }

  // Generate new parameter type definitions
  let newDefinitions = '\n';
  for (const paramName of missingTypes) {
    const paramObject = typeDetails.get(paramName);
    if (paramObject) {
      newDefinitions += `defineParameterType(${paramObject});\n`;
    }
  }

  // Append the new definitions to the file
  const updatedContent = fileContent + newDefinitions;
  fs.writeFileSync(paramTypesFilePath, updatedContent);

  console.log(`Successfully added ${missingTypes.length} parameter type definitions`);
} catch (err) {
  console.error(`Error processing parameter types file: ${err.message}`);
  process.exit(1);
}