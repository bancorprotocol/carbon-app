import { UseQueryResult } from 'libs/queries';
import { CreateStrategyOrders } from './CreateStrategyOrders';
import { CreateStrategyGraph } from './CreateStrategyGraph';
import { CreateStrategyTokenSelection } from './CreateStrategyTokenSelection';
import { OrderCreate } from './useOrder';
import { Token } from 'libs/tokens';

type CreateStrategyContentProps = {
  base: Token | undefined;
  quote: Token | undefined;
  setBase: (token: Token | undefined) => void;
  setQuote: (token: Token | undefined) => void;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string>;
  token1BalanceQuery: UseQueryResult<string>;
  isCTAdisabled: boolean;
  showOrders: boolean;
  showGraph: boolean;
  setShowGraph: (value: boolean) => void;
  createStrategy: () => void;
  openTokenListModal: (isSource?: boolean) => void;
};

export const CreateStrategyContent = ({
  base,
  quote,
  setBase,
  setQuote,
  order0,
  order1,
  showOrders,
  setShowGraph,
  showGraph,
  isCTAdisabled,
  createStrategy,
  openTokenListModal,
  token0BalanceQuery,
  token1BalanceQuery,
}: CreateStrategyContentProps) => {
  return (
    <div className="flex w-full flex-col gap-20 md:flex-row-reverse md:justify-center">
      <div
        className={`flex flex-col ${
          showGraph ? 'flex-1' : 'absolute right-20'
        }`}
      >
        {showGraph && showOrders && (
          <CreateStrategyGraph {...{ base, quote, setShowGraph }} />
        )}
      </div>
      <div className="w-full space-y-20 md:w-[400px]">
        <CreateStrategyTokenSelection
          {...{ base, quote, setBase, setQuote, openTokenListModal }}
        />
        {showOrders && (
          <CreateStrategyOrders
            {...{
              base,
              quote,
              order0,
              order1,
              createStrategy,
              isCTAdisabled,
              token0BalanceQuery,
              token1BalanceQuery,
            }}
          />
        )}
      </div>
    </div>
  );
};
