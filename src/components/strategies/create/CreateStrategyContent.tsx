import { useNavigate, useSearch } from '@tanstack/react-location';
import { CreateStrategyOrders } from './createStrategyOrders';
import { CreateStrategyGraph } from './createStrategyGraph';
import { CreateStrategyTokenSelection } from './createStrategyTokenSelection';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { useTokens } from 'hooks/useTokens';
import { useEffect } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from './useOrder';
import { UseQueryResult } from '@tanstack/react-query';

type CreateStrategyContentProps = {
  token0: Token | undefined;
  token1: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string>;
  token1BalanceQuery: UseQueryResult<string>;
  isCTAdisabled: boolean;
  showOrders: boolean;
  showGraph: boolean;
  setToken0: any;
  setToken1: any;
  showGraphToggle: () => void;
  createStrategy: () => void;
  openTokenListModal: () => void;
};

export const CreateStrategyContent = ({
  token0,
  token1,
  setToken0,
  setToken1,
  order0,
  order1,
  showOrders,
  showGraphToggle,
  showGraph,
  isCTAdisabled,
  createStrategy,
  openTokenListModal,
  token0BalanceQuery,
  token1BalanceQuery,
}: CreateStrategyContentProps) => {
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
  }, [token0, token1]);

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
        <CreateStrategyGraph
          {...{ token0, token1, showGraph, showGraphToggle }}
        />
      </div>
      <div className="w-full space-y-20 md:w-[400px]">
        <CreateStrategyTokenSelection
          {...{ token0, token1, setToken0, setToken1, openTokenListModal }}
        />
        <CreateStrategyOrders
          {...{
            token0,
            token1,
            order0,
            order1,
            showOrders,
            createStrategy,
            isCTAdisabled,
            token0BalanceQuery,
            token1BalanceQuery,
          }}
        />
      </div>
    </div>
  );
};
