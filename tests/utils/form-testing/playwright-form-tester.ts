// tests/utils/form-testing/playwright-form-tester.ts
import { PlaywrightElementAdapter } from '../adapters/playwright-element-adapter.ts';
import { BaseFormTester } from './base-form-tester';
import { Page } from '@playwright/test';

export class PlaywrightFormTester extends BaseFormTester {
  constructor(page: Page) {
    super(new PlaywrightElementAdapter(page));
  }
  // Add any Playwright-specific overrides or methods if needed
}