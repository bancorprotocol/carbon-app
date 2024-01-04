import { describe, test, expect } from 'vitest';
import { sanitizeInputOnBlur, sanitizeNumberInput } from './index';

describe('Test helpers', () => {
  test('sanitizeNumberInput', () => {
    expect(sanitizeNumberInput('abcdefghijklmnopqrstuvwxyz')).toBe('');
    expect(sanitizeNumberInput('&"\'(-_)=²~#{[|`\\^@]}¨£%µ?/§¤')).toBe('');
    expect(sanitizeNumberInput('👋')).toBe('');
    expect(sanitizeNumberInput('.')).toBe('.');
    expect(sanitizeNumberInput('.1')).toBe('.1');
    expect(sanitizeNumberInput('1.')).toBe('1.');
    expect(sanitizeNumberInput('1..1')).toBe('1.1');
    expect(sanitizeNumberInput('1.10.12')).toBe('1.1012');
    expect(sanitizeNumberInput('1,1')).toBe('1.1');
    expect(sanitizeNumberInput('10')).toBe('10');
    expect(sanitizeNumberInput('01.10')).toBe('01.10');
  });
  test('sanitizeInputOnBlur', () => {
    expect(sanitizeInputOnBlur('.')).toBe('0');
    expect(sanitizeInputOnBlur('.1')).toBe('0.1');
    expect(sanitizeInputOnBlur('1.1010')).toBe('1.101');
    expect(sanitizeInputOnBlur('01.100')).toBe('1.1');
  });
});
