import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-location';
import { UseQueryResult } from '@tanstack/react-query';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { CreateStrategyOrders } from './CreateStrategyOrders';
import { CreateStrategyGraph } from './CreateStrategyGraph';
import { CreateStrategyTokenSelection } from './CreateStrategyTokenSelection';
import { useTokens } from 'hooks/useTokens';
import { OrderCreate } from './useOrder';
import { Token } from 'libs/tokens';
import { pairsToExchangeMapping } from 'components/tradingviewChart/utils';

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
  openTokenListModal: () => void;
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
  const navigate = useNavigate<MyLocationGenerics>();
  const search = useSearch<MyLocationGenerics>();
  const { base: baseAddress, quote: quoteAddress } = search;
  const { getTokenById } = useTokens();

  useEffect(() => {
    navigate({
      search: {
        ...search,
        ...{
          ...(base && {
            base: base.address,
          }),
          ...(quote && {
            quote: quote.address,
          }),
        },
      },
    });
    if (pairsToExchangeMapping[`${base?.symbol}${quote?.symbol}`]) {
      setShowGraph(true);
    }
    if (!base || !quote) {
      setShowGraph(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, quote, setShowGraph, navigate]);

  useEffect(() => {
    setBase(getTokenById(baseAddress || ''));
    setQuote(getTokenById(quoteAddress || ''));
  }, [base, quote, setBase, setQuote, getTokenById, baseAddress, quoteAddress]);

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
