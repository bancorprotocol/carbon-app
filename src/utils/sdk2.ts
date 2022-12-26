import { BigNumber } from 'ethers';
import Decimal from 'decimal.js';
export { Decimal, BigNumber };

Decimal.set({ precision: 50, rounding: Decimal.ROUND_HALF_DOWN });
const ONE = 2 ** 32;

export interface EncodedOrder {
  y: BigNumber;
  z: BigNumber;
  A: BigNumber;
  B: BigNumber;
}

export interface DecodedOrder {
  liquidity: Decimal;
  lowestRate: Decimal;
  highestRate: Decimal;
  marginalRate: Decimal;
}

export const encode = (x: Decimal): Decimal => x.sqrt().mul(ONE);

export const decode = (x: Decimal): Decimal => x.div(ONE).pow(2);

export const encodeOrder = (order: DecodedOrder): EncodedOrder => {
  const liq = BigNumber.from(order.liquidity.toFixed());
  const min = BigNumber.from(encode(order.lowestRate).toFixed(0));
  const max = BigNumber.from(encode(order.highestRate).toFixed(0));
  const mid = BigNumber.from(encode(order.marginalRate).toFixed(0));
  return {
    y: liq,
    z: liq.mul(max.sub(min)).div(mid.sub(min)),
    A: max.sub(min),
    B: min,
  };
};

export const decodeOrder = (order: EncodedOrder): DecodedOrder => {
  const y = new Decimal(order.y.toString());
  const z = new Decimal(order.z.toString());
  const A = new Decimal(order.A.toString());
  const B = new Decimal(order.B.toString());
  const yOverZ = y.eq(z) ? new Decimal(1) : y.div(z);
  return {
    liquidity: y,
    lowestRate: decode(B),
    highestRate: decode(B.add(A)),
    marginalRate: decode(B.add(A.mul(yOverZ))),
  };
};
