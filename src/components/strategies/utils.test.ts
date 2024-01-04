import { describe, test, expect } from 'vitest';
import { isValidRange } from './utils';

describe('Test strategy utils', () => {
  test('isValidRange', () => {
    expect(isValidRange('-1', '100')).toBeFalsy();
    expect(isValidRange('0', '100')).toBeFalsy();
    expect(isValidRange('20', '1')).toBeFalsy();
    expect(isValidRange('.', '1')).toBeFalsy();
    expect(isValidRange('1', '.')).toBeFalsy();
    expect(isValidRange('abc', '10')).toBeFalsy();
    expect(isValidRange('20', '100')).toBeTruthy();
    expect(isValidRange('.2', '.3')).toBeTruthy();
  });
});
