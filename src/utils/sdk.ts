import { CreateStrategyParams } from 'queries';
import { encodeOrder } from 'utils/sdk2';
import { expandToken } from 'utils/tokens';
import BigNumber from 'bignumber.js';

export const toStrategy = ({
  token0,
  token1,
  order0,
  order1,
}: CreateStrategyParams) => {
  const order0Budget = order0.budget
    ? expandToken(order0.budget, token1.decimals)
    : '0';
  const order1Budget = order1.budget
    ? expandToken(order1.budget, token0.decimals)
    : '0';

  const order0Low = order0.price ? order0.price : order0.min ? order0.min : '0';
  const order0Max = order0.price ? order0.price : order0.max ? order0.max : '0';

  const order1Low = order1.price ? order1.price : order1.min ? order1.min : '0';
  const order1Max = order1.price ? order1.price : order1.max ? order1.max : '0';

  // ATTENTION *****************************
  // This is the sell order | UI order 1 and CONTRACT order 0
  // ATTENTION *****************************
  const encodedOrder0 = encodeOrder({
    liquidity: order1Budget,
    lowestRate: new BigNumber(1)
      .div(order1Max)
      .times(new BigNumber(10).pow(token0.decimals - token1.decimals))
      .toString(),
    highestRate: new BigNumber(1)
      .div(order1Low)
      .times(new BigNumber(10).pow(token0.decimals - token1.decimals))
      .toString(),
    marginalRate: order1Budget,
  });

  // ATTENTION *****************************
  // This is the buy order | UI order 0 and CONTRACT order 1
  // ATTENTION *****************************
  const encodedOrder1 = encodeOrder({
    liquidity: order0Budget,
    lowestRate: new BigNumber(order0Low)
      .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
      .toString(),
    highestRate: new BigNumber(order0Max)
      .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
      .toString(),
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
