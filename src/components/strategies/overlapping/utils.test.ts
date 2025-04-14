import { describe, test, expect } from 'vitest';
import { isValidSpread } from './utils';

describe('Test overlapping utils', () => {
  test('isValidSpread', () => {
    expect(isValidSpread('100', '200', -1)).toBeFalsy();
    expect(isValidSpread('100', '200', 0)).toBeFalsy();
    expect(isValidSpread('100', '200', 10)).toBeTruthy();
    expect(isValidSpread('100', '200', 30)).toBeFalsy();
    expect(isValidSpread('100', '200', 100)).toBeFalsy();
    expect(isValidSpread('100', '200', 101)).toBeFalsy();
    expect(isValidSpread('100', '200', NaN)).toBeFalsy();
  });
});
