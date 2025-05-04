// tests/utils/table-testing/factory.ts
import { Page } from '@playwright/test';
import { TableTester } from './types';
import { BaseTableTester } from './base-table-tester';
import { RTLElementAdapter } from '../adapters/rtl-element-adapter.ts';
import { PlaywrightElementAdapter } from '../adapters/playwright-element-adapter.ts';

export function createRTLTableTester(): TableTester {
  return new BaseTableTester(new RTLElementAdapter());
}

export function createPlaywrightTableTester(page: Page): TableTester {
  return new BaseTableTester(new PlaywrightElementAdapter(page));
}