import { BigNumber } from 'ethers';
import Decimal from 'decimal.js';

Decimal.set({ precision: 50, rounding: Decimal.ROUND_HALF_DOWN });

export { Decimal, BigNumber };

const ONE = 2 ** 32;

const sqrtScaled = (x: string | Decimal.Value) => {
  return BigNumber.from(new Decimal(x).sqrt().mul(ONE).toFixed(0));
};

export interface EncodedOrder {
  y: BigNumber | string;
  z: BigNumber | string;
  A: BigNumber | string;
  B: BigNumber | string;
}

export interface DecodedOrder {
  liquidity: Decimal.Value;
  lowestRate: Decimal.Value;
  highestRate: Decimal.Value;
  marginalRate: Decimal.Value;
}

export const encodeOrder = (order: DecodedOrder): EncodedOrder => {
  const liquidity = BigNumber.from(order.liquidity);
  const lowestRate = sqrtScaled(order.lowestRate);
  const highestRate = sqrtScaled(order.highestRate);
  const marginalRate = sqrtScaled(order.marginalRate);

  return {
    y: liquidity,
    z: liquidity
      .mul(highestRate.sub(lowestRate))
      .div(marginalRate.sub(lowestRate)),
    A: highestRate.sub(lowestRate),
    B: lowestRate,
  };
};

export const decodeOrder = (order: EncodedOrder): DecodedOrder => {
  const y = new Decimal(order.y.toString());
  const z = new Decimal(order.z.toString());
  const A = new Decimal(order.A.toString());
  const B = new Decimal(order.B.toString());

  return {
    liquidity: y,
    lowestRate: B.div(ONE).pow(2),
    highestRate: y.mul(A).add(z.mul(B)).div(z.mul(ONE)).pow(2),
    marginalRate: A.add(B).div(ONE).pow(2),
  };
};
