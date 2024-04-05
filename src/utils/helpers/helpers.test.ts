import { shortenString } from '.';
import { describe, it, expect } from 'vitest';

describe('shortenString', () => {
  const testCases: [string, string | undefined, number | undefined, string][] =
    [
      ['', undefined, undefined, ''],
      ['abcdefghijklmnopqrstuvwxyz', undefined, undefined, 'abcde...vwxyz'],
      ['abcdefghijklmnopqrstuvwxyz', '-', undefined, 'abcdef-uvwxyz'],
      ['abcdefghijklmnopqrstuvwxyz', undefined, 7, 'ab...yz'],
      ['🐶🐶🐶🐶🐶', undefined, undefined, '🐶🐶🐶🐶🐶'],
      [
        '🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶',
        undefined,
        undefined,
        '🐶🐶🐶🐶🐶...🐶🐶🐶🐶🐶',
      ],
      ['👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧', undefined, undefined, '👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧'],
      [
        '👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧',
        undefined,
        undefined,
        '👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧...👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧',
      ],
    ];

  testCases.forEach(([stringToShorten, separator, toLength, expected]) => {
    const description = `shortenString('${stringToShorten}', ${separator}, ${toLength}) should return '${expected}'`;

    it(description, () => {
      const result = shortenString(stringToShorten, separator, toLength);
      expect(result).toEqual(expected);
    });
  });
});
