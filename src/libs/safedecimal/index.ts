import { Decimal } from 'decimal.js';

/**
 * Sanitizes the input value for safe decimal creation.
 * If the value is a string, it checks if it's a valid
 * - Decimal (with the same criteria as bignumber.js),
 * - Binary, hex, octal or special (case-sensitive Infinity or NaN).
 * If it's not, it returns 'NaN'.
 * If the value is not a string, it returns the value as is.
 *
 * @param {Decimal.Value} value - The value to sanitize.
 * @returns {string | Decimal.Value} - The sanitized value.
 */
function sanitizeDecimal(value: Decimal.Value) {
  if (typeof value === 'string') {
    const isDecimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
    const isSpecial = /^[+-]?Infinity|NaN/;
    const isBinary = /^[+-]?0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
    const isOctal = /^[+-]?0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
    const isHex = /^[+-]?0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
    const trimmedNumber = value.trim();
    if (
      isDecimal.test(trimmedNumber) ||
      isSpecial.test(trimmedNumber) ||
      isBinary.test(trimmedNumber) ||
      isOctal.test(trimmedNumber) ||
      isHex.test(trimmedNumber)
    ) {
      return trimmedNumber;
    } else {
      return 'NaN';
    }
  } else {
    return value;
  }
}

/**
 * A safe decimal class that extends the Decimal class from decimal.js.
 * It sanitizes the input value before passing it to the Decimal constructor.
 * If the value is not parseable, it passes 'NaN' to the Decimal constructor.
 */
class SafeDecimal extends Decimal {
  /**
   * Creates a new SafeDecimal instance.
   *
   * @param {Decimal.Value} value - The value to create the decimal from.
   */
  constructor(value: Decimal.Value) {
    super(sanitizeDecimal(value)); // will do super('NaN') if value is not parseable
    this.constructor = SafeDecimal; // Decimal.js overrides the constructor on every instance to be Decimal, so it's set here again
  }
}

export { SafeDecimal };
