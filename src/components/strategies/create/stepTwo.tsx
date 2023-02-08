import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { UseQueryResult } from 'libs/queries';
import { Token } from 'libs/tokens';
import { items } from './index';
import { BuySellBlock } from './BuySellBlock';
import { OrderCreate } from './useOrder';

type StepTwoProps = {
  token0: Token | undefined;
  token1: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string>;
  token1BalanceQuery: UseQueryResult<string>;
  isCTAdisabled: boolean;
  createStrategy: () => void;
};

export const StepTwo = ({
  token0,
  token1,
  order0,
  order1,
  createStrategy,
  isCTAdisabled,
  token0BalanceQuery,
  token1BalanceQuery,
}: StepTwoProps) => {
  return (
    <>
      <m.div variants={items}>
        <BuySellBlock
          token0={token0!}
          token1={token1!}
          order={order0}
          buy
          tokenBalanceQuery={token1BalanceQuery}
        />
      </m.div>

      <m.div variants={items}>
        <BuySellBlock
          token0={token0!}
          token1={token1!}
          order={order1}
          tokenBalanceQuery={token0BalanceQuery}
        />
      </m.div>
      <m.div variants={items}>
        <Button
          className="mb-80"
          variant={'success'}
          size={'lg'}
          fullWidth
          onClick={createStrategy}
          disabled={isCTAdisabled}
        >
          Create Strategy
        </Button>
      </m.div>
    </>
  );
};
