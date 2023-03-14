import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-location';
import { UseQueryResult } from '@tanstack/react-query';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { CreateStrategyOrders } from './EditStrategyOrders';
import { EditStrategyGraph } from './EditStrategyGraph';
import { useTokens } from 'hooks/useTokens';
import { Token } from 'libs/tokens';
import { pairsToExchangeMapping } from 'components/tradingviewChart/utils';
import { OrderCreate } from '../create/useOrder';

type EditStrategyContentProps = {
  token0: Token | undefined;
  token1: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string>;
  token1BalanceQuery: UseQueryResult<string>;
  isCTAdisabled: boolean;
  showOrders: boolean;
  showGraph: boolean;
  setToken0: (token: Token | undefined) => void;
  setToken1: (token: Token | undefined) => void;
  setShowGraph: (value: boolean) => void;
  createStrategy: () => void;
  openTokenListModal: () => void;
};

export const EditStrategyContent = ({
  token0,
  token1,
  setToken0,
  setToken1,
  order0,
  order1,
  showOrders,
  setShowGraph,
  showGraph,
  isCTAdisabled,
  createStrategy,
  token0BalanceQuery,
  token1BalanceQuery,
}: EditStrategyContentProps) => {
  const navigate = useNavigate<MyLocationGenerics>();
  const search = useSearch<MyLocationGenerics>();
  const { base, quote } = search;
  const { getTokenById } = useTokens();

  useEffect(() => {
    navigate({
      search: {
        ...search,
        ...{
          ...(token0 && {
            base: token0.address,
          }),
          ...(token1 && {
            quote: token1.address,
          }),
        },
      },
    });
    if (pairsToExchangeMapping[`${token0?.symbol}${token1?.symbol}`]) {
      setShowGraph(true);
    }
    if (!token0 || !token1) {
      setShowGraph(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token0, token1, setShowGraph, navigate]);

  useEffect(() => {
    setToken0(getTokenById(base || ''));
    setToken1(getTokenById(quote || ''));
  }, [base, quote, setToken0, setToken1, getTokenById]);

  return (
    <div className="flex w-full flex-col gap-20 md:flex-row-reverse md:justify-center">
      <div
        className={`flex flex-col ${
          showGraph ? 'flex-1' : 'absolute right-20'
        }`}
      >
        {showGraph && showOrders && (
          <EditStrategyGraph {...{ token0, token1, setShowGraph }} />
        )}
      </div>
      <div className="w-full space-y-20 md:w-[400px]">
        {showOrders && (
          <CreateStrategyOrders
            {...{
              token0,
              token1,
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
