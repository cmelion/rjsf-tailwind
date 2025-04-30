// tests/utils/table-testing/factory.ts
import { Page } from '@playwright/test';
import { TableTester } from './types';
import { BaseTableTester } from './base-table-tester';
import { RTLElementAdapter } from './rtl-element-adapter';
import { PlaywrightElementAdapter } from './playwright-element-adapter';

export function createRTLTableTester(): TableTester {
  return new BaseTableTester(new RTLElementAdapter());
}

export function createPlaywrightTableTester(page: Page): TableTester {
  return new BaseTableTester(new PlaywrightElementAdapter(page));
}