import { CreateStrategyParams } from 'queries';
import { encodeOrder, Decimal, BigNumber } from 'utils/sdk2';
import { expandToken } from 'utils/tokens';

export const toStrategy = ({ token0, token1 }: CreateStrategyParams) => {
  const token0Balance = token0.balance
    ? expandToken(token0.balance, token0.token.decimals)
    : '0';
  const token1Balance = token1.balance
    ? expandToken(token1.balance, token1.token.decimals)
    : '0';

  const token0Low = token0.price ? token0.price : token0.min ? token0.min : 0;
  const token0Max = token0.price ? token0.price : token0.max ? token0.max : 0;

  const token1Low = token1.price ? token1.price : token1.min ? token1.min : 0;
  const token1Max = token1.price ? token1.price : token1.max ? token1.max : 0;

  const order0 = encodeOrder({
    currentRate: new Decimal(token0Balance),
    lowestRate: new Decimal(token0Low),
    highestRate: new Decimal(token0Max),
    liquidity: BigNumber.from(token0Balance),
  });

  const order1 = encodeOrder({
    currentRate: new Decimal(token1Balance),
    lowestRate: new Decimal(token1Low),
    highestRate: new Decimal(token1Max),
    liquidity: BigNumber.from(token1Balance),
  });

  return [
    token0.token.address,
    token1.token.address,
    order0.y,
    order0.y,
    order0.A,
    order0.B,
    order1.y,
    order1.y,
    order1.A,
    order1.B,
  ] as const;
};
