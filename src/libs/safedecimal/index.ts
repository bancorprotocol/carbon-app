import { Decimal } from 'decimal.js';

function sanitizeDecimal(value: Decimal.Value) {
  if (typeof value === 'string') {
    const isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
    const trimmedNumber = value.trim();
    if (isNumeric.test(trimmedNumber)) {
      return trimmedNumber;
    } else {
      return 'NaN';
    }
  } else {
    return value;
  }
}

class SafeDecimal extends Decimal {
  constructor(value: Decimal.Value) {
    super(sanitizeDecimal(value)); // will do super('NaN') if value is not parseable
    this.constructor = SafeDecimal;
  }
}

export { SafeDecimal };
