import { CreateStrategyParams } from 'queries';
import { encodeOrder, Decimal, BigNumber } from 'utils/sdk2';
import { expandToken } from 'utils/tokens';

export const toStrategy = ({
  token0,
  token1,
  order0,
  order1,
}: CreateStrategyParams) => {
  const token0Balance = order0.balance
    ? expandToken(order0.balance, token0.decimals)
    : '0';
  const token1Balance = order1.balance
    ? expandToken(order1.balance, token1.decimals)
    : '0';

  const token0Low = order0.price ? order0.price : order0.min ? order0.min : '0';
  const token0Max = order0.price ? order0.price : order0.max ? order0.max : '0';

  const token1Low = order1.price ? order1.price : order1.min ? order1.min : '0';
  const token1Max = order1.price ? order1.price : order1.max ? order1.max : '0';

  // TODO make sure it is the sell order - switch it
  const encodedOrder0 = encodeOrder({
    currentRate: new Decimal(token0Balance),
    lowestRate: new Decimal(token0Low), // TODO 1/TKN max amount
    highestRate: new Decimal(token0Max), // TODO 1/TKN min amount
    liquidity: BigNumber.from(token0Balance),
  });

  const encodedOrder1 = encodeOrder({
    currentRate: new Decimal(token1Balance),
    lowestRate: new Decimal(token1Low),
    highestRate: new Decimal(token1Max),
    liquidity: BigNumber.from(token1Balance),
  });

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
