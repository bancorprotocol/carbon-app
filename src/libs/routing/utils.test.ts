import { parseSearchWith } from './utils';
import { describe, it, expect } from 'vitest';

describe('parseSearchWith', () => {
  const parser = parseSearchWith(JSON.parse);
  it('should parse number to string and string numbers to double string', () => {
    const url =
      "?number1=1&number2=0.2&number3=0.1&number4='1'&number5='0.2'&number6='0.1'&number7='.'&number8=.";
    const queryKeys = parser(url);

    expect(queryKeys).toStrictEqual({
      number1: '1',
      number2: '0.2',
      number3: '0.1',
      number4: "'1'",
      number5: "'0.2'",
      number6: "'0.1'",
      number7: "'.'",
      number8: '.',
    });
  });
  it('should parse non-number strings to string', () => {
    const url = "?string1=hello&string2='hello'";
    const queryKeys = parser(url);

    expect(queryKeys).toStrictEqual({
      string1: 'hello',
      string2: "'hello'",
    });
  });
});
