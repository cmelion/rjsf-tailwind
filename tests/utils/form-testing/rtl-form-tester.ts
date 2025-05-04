// tests/utils/form-testing/rtl-form-tester.ts
import { RTLElementAdapter } from '../adapters/rtl-element-adapter.ts';
import { BaseFormTester } from './base-form-tester';

export class RTLFormTester extends BaseFormTester {
  constructor() {
    super(new RTLElementAdapter());
  }
  // Add any RTL-specific overrides or methods if needed
}