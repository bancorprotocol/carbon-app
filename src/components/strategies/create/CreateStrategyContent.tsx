import { UseQueryResult } from '@tanstack/react-query';
import { CreateStrategyOrders } from './CreateStrategyOrders';
import { CreateStrategyGraph } from './CreateStrategyGraph';
import { CreateStrategyTokenSelection } from './CreateStrategyTokenSelection';
import { OrderCreate } from './useOrder';
import { Token } from 'libs/tokens';
import {
  StrategyDirection,
  StrategySettings,
  StrategyType,
} from 'components/strategies/create/CreateStrategyMain';
import { Button } from 'components/common/button';
import { Link, PathNames } from 'libs/routing';

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
  strategyType?: StrategyType;
  strategyDirection?: StrategyDirection;
  strategySettings?: StrategySettings;
  isDuplicate?: boolean;
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
  strategySettings,
  strategyDirection,
  strategyType,
  isDuplicate,
}: CreateStrategyContentProps) => {
  const showTokenSelection = !strategyType || !strategySettings;

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
        {showTokenSelection && (
          <>
            <CreateStrategyTokenSelection
              {...{ base, quote, setBase, setQuote, openTokenListModal }}
            />
            {showOrders && (
              <>
                <div>
                  <Link
                    to={PathNames.createStrategy}
                    search={{
                      base: base?.address,
                      quote: quote?.address,
                      strategyType: 'reoccurring',
                    }}
                  >
                    <Button>Reoccurring</Button>
                  </Link>
                  <Link
                    to={PathNames.createStrategy}
                    search={{
                      base: base?.address,
                      quote: quote?.address,
                      strategyType: 'disposable',
                    }}
                  >
                    <Button>Disposable</Button>
                  </Link>
                </div>
                <div>
                  {strategyType === 'reoccurring' && (
                    <div>
                      reoccuring
                      <Link
                        to={PathNames.createStrategy}
                        search={{
                          base: base?.address,
                          quote: quote?.address,
                          strategyType: 'reoccurring',
                          strategySettings: 'limit',
                        }}
                      >
                        limit
                      </Link>
                      <Link
                        to={PathNames.createStrategy}
                        search={{
                          base: base?.address,
                          quote: quote?.address,
                          strategyType: 'reoccurring',
                          strategySettings: 'range',
                        }}
                      >
                        range
                      </Link>
                      <Link
                        to={PathNames.createStrategy}
                        search={{
                          base: base?.address,
                          quote: quote?.address,
                          strategyType: 'reoccurring',
                          strategySettings: 'custom',
                        }}
                      >
                        custom
                      </Link>
                    </div>
                  )}
                  {strategyType === 'disposable' && (
                    <div>
                      disposable
                      <Link
                        to={PathNames.createStrategy}
                        search={{
                          base: base?.address,
                          quote: quote?.address,
                          strategyType: 'disposable',
                          strategySettings: 'limit',
                          strategyDirection: 'buy',
                        }}
                      >
                        buy limit
                      </Link>
                      <Link
                        to={PathNames.createStrategy}
                        search={{
                          base: base?.address,
                          quote: quote?.address,
                          strategyType: 'disposable',
                          strategySettings: 'range',
                          strategyDirection: 'buy',
                        }}
                      >
                        buy range
                      </Link>
                      <Link
                        to={PathNames.createStrategy}
                        search={{
                          base: base?.address,
                          quote: quote?.address,
                          strategyType: 'disposable',
                          strategySettings: 'limit',
                          strategyDirection: 'sell',
                        }}
                      >
                        sell limit
                      </Link>
                      <Link
                        to={PathNames.createStrategy}
                        search={{
                          base: base?.address,
                          quote: quote?.address,
                          strategyType: 'disposable',
                          strategySettings: 'range',
                          strategyDirection: 'sell',
                        }}
                      >
                        sell range
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
        {((strategySettings && base && quote) || isDuplicate) && (
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
              strategyDirection,
            }}
          />
        )}
      </div>
    </div>
  );
};
