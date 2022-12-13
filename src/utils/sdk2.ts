import { BigNumber } from 'ethers';
import Decimal from 'decimal.js';

Decimal.set({ precision: 50, rounding: Decimal.ROUND_HALF_DOWN });

export { Decimal, BigNumber };

export const ONE = 2 ** 32;

export interface EncodedOrder {
  y: BigNumber;
  z: BigNumber;
  A: BigNumber;
  B: BigNumber;
}

export class EncodedOrder implements EncodedOrder {
  y: BigNumber;
  z: BigNumber;
  A: BigNumber;
  B: BigNumber;
  constructor(y: BigNumber, z: BigNumber, A: BigNumber, B: BigNumber) {
    this.y = BigNumber.from(y);
    this.z = BigNumber.from(z);
    this.A = BigNumber.from(A);
    this.B = BigNumber.from(B);
  }
}

export interface DecodedOrder {
  liquidity: BigNumber;
  currentRate: Decimal;
  highestRate: Decimal;
  lowestRate: Decimal;
}

export class DecodedOrder implements DecodedOrder {
  liquidity: BigNumber;
  currentRate: Decimal;
  highestRate: Decimal;
  lowestRate: Decimal;
  constructor(
    liquidity: BigNumber,
    currentRate: Decimal,
    highestRate: Decimal,
    lowestRate: Decimal
  ) {
    this.liquidity = BigNumber.from(liquidity);
    this.currentRate = new Decimal(currentRate);
    this.highestRate = new Decimal(highestRate);
    this.lowestRate = new Decimal(lowestRate);
  }
}

export const sqrtScaled = (x: Decimal) =>
  BigNumber.from(x.sqrt().mul(ONE).floor().toFixed());

export const encodeOrder = (order: DecodedOrder) => {
  const currentRate = sqrtScaled(order.currentRate);
  const highestRate = sqrtScaled(order.highestRate);
  const lowestRate = sqrtScaled(order.lowestRate);
  const liquidity = order.liquidity;
  return new EncodedOrder(
    liquidity,
    liquidity.mul(highestRate.sub(lowestRate)).div(currentRate.sub(lowestRate)),
    highestRate.sub(lowestRate),
    lowestRate
  );
};

export const decodeOrder = (order: EncodedOrder) => {
  const y = new Decimal(order.y.toString());
  const z = new Decimal(order.z.toString());
  const A = new Decimal(order.A.toString());
  const B = new Decimal(order.B.toString());
  return new DecodedOrder(
    BigNumber.from(y.toFixed()),
    y.mul(A).add(z.mul(B)).div(z.mul(ONE)).pow(2),
    A.add(B).div(ONE).pow(2),
    B.div(ONE).pow(2)
  );
};
