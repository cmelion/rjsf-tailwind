// src/components/tests/utils/story-helpers.ts

/**
 * Story Composition Helpers
 *
 * This module provides optimized, lazy-loading access to Storybook stories
 * for use in testing. It implements a cache pattern that ensures stories are:
 *
 * 1. Only imported when first needed (lazy loading)
 * 2. Cached after first access (singleton pattern)
 * 3. Only compiled once with composeStories (performance optimization)
 *
 * The dynamic import approach prevents the entire Storybook dependency tree
 * from being eagerly loaded during test startup, which significantly improves:
 * - Test initialization time
 * - Memory usage during testing
 * - Test isolation by loading only what's needed
 */

import { composeStories } from "@storybook/react";
import type * as TailwindTableStoriesModule from "../../tailwind-table/TailwindTable.stories";
import type * as AppStoriesModule from "@/App.stories";

// The actual story result types for internal use
export type ComponentStoriesType = ReturnType<typeof composeStories<typeof TailwindTableStoriesModule>>;
export type AppStoriesType = ReturnType<typeof composeStories<typeof AppStoriesModule>>;

// Derive story names directly from the composed stories type's keys
export type ComponentStoryName = keyof ComponentStoriesType;

// Cache for component stories
let componentStoriesCache: ComponentStoriesType | null = null;

/**
 * Lazily loads and composes TailwindTable stories
 *
 * Stories are only loaded and composed on first call,
 * then cached for subsequent access.
 *
 * @returns Composed TailwindTable stories
 */
export const getComponentStories = async () => {
  if (!componentStoriesCache) {
    // Dynamic import ensures the module is only loaded when needed
    const TailwindTableStories = await import("../../tailwind-table/TailwindTable.stories.tsx");
    componentStoriesCache = composeStories(TailwindTableStories);
  }
  return componentStoriesCache;
};

// Cache for app stories
let appStoriesCache: AppStoriesType | null = null;

/**
 * Lazily loads and composes App stories
 *
 * Stories are only loaded and composed on first call,
 * then cached for subsequent access.
 *
 * @returns Composed App stories
 */
export const getAppStories = async () => {
  if (!appStoriesCache) {
    // Dynamic import ensures the module is only loaded when needed
    const AppStories = await import("@/App.stories");
    appStoriesCache = composeStories(AppStories);
  }
  return appStoriesCache;
};