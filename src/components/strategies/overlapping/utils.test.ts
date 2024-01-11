import { describe, test, expect } from 'vitest';
import { isValidSpread } from './utils';

describe('Test overlapping utils', () => {
  test('isValidSpread', () => {
    expect(isValidSpread(-1)).toBeFalsy();
    expect(isValidSpread(0)).toBeFalsy();
    expect(isValidSpread(10)).toBeTruthy();
    expect(isValidSpread(100)).toBeFalsy();
    expect(isValidSpread(101)).toBeFalsy();
    expect(isValidSpread(NaN)).toBeFalsy();
  });
});
