import { describe, test, expect } from 'vitest';
import { isValidLimit, isValidOrder, isValidRange } from './utils';

describe('Test strategy utils', () => {
  test('isValidLimit', () => {
    expect(isValidLimit('')).toBeFalsy();
    expect(isValidLimit('.')).toBeFalsy();
    expect(isValidLimit('-1')).toBeFalsy();
    expect(isValidLimit('0')).toBeFalsy();
    expect(isValidLimit('10')).toBeTruthy();
  });
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
  test('isValidOrder', () => {
    const rangeInvalid = { isRange: true, min: '0', max: '100', price: '10' };
    const limitInvalid = { isRange: false, min: '0', max: '100', price: '0' };
    const rangeValid = { isRange: true, min: '1', max: '100', price: '10' };
    const limitValid = { isRange: false, min: '0', max: '100', price: '1' };
    expect(isValidOrder(rangeInvalid)).toBeFalsy();
    expect(isValidOrder(limitInvalid)).toBeFalsy();
    expect(isValidOrder(rangeValid)).toBeTruthy();
    expect(isValidOrder(limitValid)).toBeTruthy();
  });
});
