// Import the roles object from aria-query
import { roles } from 'aria-query';

// Create a union type from the keys of the roles object
export type AriaRole = keyof typeof roles;
