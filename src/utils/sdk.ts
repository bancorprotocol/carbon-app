import { CreateStrategyParams } from 'queries';
import { encodeOrder, Decimal, BigNumber } from 'utils/sdk2';
import { expandToken } from 'utils/tokens';

export const toStrategy = ({ token0, token1 }: CreateStrategyParams) => {
  const token0Balance = expandToken(token0.balance, token0.token.decimals);
  const token1Balance = expandToken(token1.balance, token1.token.decimals);

  const order0 = encodeOrder({
    currentRate: new Decimal(token0Balance),
    lowestRate: new Decimal(token0.min),
    highestRate: new Decimal(token0.max),
    liquidity: BigNumber.from(token0Balance),
  });

  const order1 = encodeOrder({
    currentRate: new Decimal(token1Balance),
    lowestRate: new Decimal(token1.min),
    highestRate: new Decimal(token1.max),
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
