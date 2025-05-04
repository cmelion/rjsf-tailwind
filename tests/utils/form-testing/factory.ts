// tests/utils/form-testing/factory.ts
import { Page } from '@playwright/test';
import { FormTester } from './types';
import { BaseFormTester } from './base-form-tester';
import { PlaywrightElementAdapter } from '../adapters/playwright-element-adapter';
import { RTLElementAdapter } from '../adapters/rtl-element-adapter';

export function createPlaywrightFormTester(page: Page): FormTester {
  const adapter = new PlaywrightElementAdapter(page);
  return new BaseFormTester(adapter);
}

export function createRTLFormTester(): FormTester {
  const adapter = new RTLElementAdapter();
  return new BaseFormTester(adapter);
}