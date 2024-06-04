import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { formatNumber } from 'utils/helpers';
export const isNil = (value?: string): value is '' | '0' | '.' | undefined => {
  if (!value) return true;
  return isZero(value);
};
export const isZero = (value: string): value is '0' | '.' => {
  if (!value) return false;
  return !+formatNumber(value);
};

interface OutsideMarketParams {
  base?: Token;
  min?: string;
  max?: string;
  marketPrice?: number;
  buy?: boolean;
}
export const outSideMarketWarning = (params: OutsideMarketParams) => {
  const { base, min, max, marketPrice, buy } = params;
  if (!marketPrice) return;
  if (buy) {
    const price = isNil(max) ? min : max;
    if (isNil(price)) return;
    if (new SafeDecimal(price).gt(marketPrice)) {
      return `Notice: you offer to buy ${base?.symbol} above current market price`;
    }
  } else {
    const price = isNil(min) ? max : min;
    if (isNil(price)) return;
    if (new SafeDecimal(price).lt(marketPrice)) {
      return `Notice: you offer to sell ${base?.symbol} below current market price`;
    }
  }
};
