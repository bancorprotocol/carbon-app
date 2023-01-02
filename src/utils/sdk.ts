import { CreateStrategyParams } from 'libs/queries';
import { Decimal, encodeOrder } from 'utils/sdk2';
import { expandToken } from 'utils/tokens';

export const toStrategy = ({
  token0,
  token1,
  order0,
  order1,
}: CreateStrategyParams) => {
  const zero = new Decimal(0);
  const order0Budget = order0.budget
    ? new Decimal(expandToken(order0.budget, token1.decimals))
    : zero;
  const order1Budget = order1.budget
    ? new Decimal(expandToken(order1.budget, token0.decimals))
    : zero;

  const order0Low = order0.price ? order0.price : order0.min ? order0.min : '0';
  const order0Max = order0.price ? order0.price : order0.max ? order0.max : '0';

  const order1Low = order1.price ? order1.price : order1.min ? order1.min : '0';
  const order1Max = order1.price ? order1.price : order1.max ? order1.max : '0';

  // ATTENTION *****************************
  // This is the sell order | UI order 1 and CONTRACT order 0
  // ATTENTION *****************************
  const encodedOrder0 = encodeOrder({
    liquidity: order1Budget,
    lowestRate: new Decimal(1)
      .div(order1Max)
      .times(new Decimal(10).pow(token1.decimals - token0.decimals)),
    highestRate: new Decimal(1)
      .div(order1Low)
      .times(new Decimal(10).pow(token1.decimals - token0.decimals)),
    marginalRate: order1Budget,
  });

  // ATTENTION *****************************
  // This is the buy order | UI order 0 and CONTRACT order 1
  // ATTENTION *****************************
  const encodedOrder1 = encodeOrder({
    liquidity: order0Budget,
    lowestRate: new Decimal(order0Low).times(
      new Decimal(10).pow(token0.decimals - token1.decimals)
    ),
    highestRate: new Decimal(order0Max).times(
      new Decimal(10).pow(token0.decimals - token1.decimals)
    ),
    marginalRate: order0Budget,
  });

  console.log({ encodedOrder0, encodedOrder1 });

  return [
    token0.address,
    token1.address,
    encodedOrder0.y,
    encodedOrder0.y,
    encodedOrder0.A,
    encodedOrder0.B,
    encodedOrder1.y,
    encodedOrder1.y,
    encodedOrder1.A,
    encodedOrder1.B,
  ] as const;
};
