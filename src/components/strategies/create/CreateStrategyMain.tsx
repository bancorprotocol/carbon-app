import { useEffect, useState } from 'react';
import { m } from 'libs/motion';
import { list } from './variants';
import { useCreateStrategy } from './useCreateStrategy';
import { CreateStrategyHeader } from './CreateStrategyHeader';
import { CreateStrategyContent } from './CreateStrategyContent';
import { useSearch } from 'libs/routing';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { useTokens } from 'hooks/useTokens';
import { pairsToExchangeMapping } from 'components/tradingviewChart/utils';

export const CreateStrategyMain = () => {
  const [showGraph, setShowGraph] = useState(false);

  const {
    base,
    quote,
    setBase,
    setQuote,
    openTokenListModal,
    showOrders,
    order0,
    order1,
    createStrategy,
    isCTAdisabled,
    token0BalanceQuery,
    token1BalanceQuery,
  } = useCreateStrategy();

  const search = useSearch<MyLocationGenerics>();
  const { base: baseAddress, quote: quoteAddress } = search;
  const { getTokenById } = useTokens();

  useEffect(() => {
    if (pairsToExchangeMapping[`${base?.symbol}${quote?.symbol}`]) {
      setShowGraph(true);
    }
    if (!base || !quote) {
      setShowGraph(false);
    }
  }, [base, quote, setShowGraph]);

  useEffect(() => {
    if (!baseAddress && !quoteAddress) {
      return;
    }
    setBase(getTokenById(baseAddress || ''));
    setQuote(getTokenById(quoteAddress || ''));
  }, [getTokenById, baseAddress, quoteAddress, setBase, setQuote]);

  return (
    <m.div
      className={`flex flex-col items-center space-y-20 p-20 ${
        showGraph ? 'justify-between' : 'justify-center'
      }`}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <CreateStrategyHeader {...{ showGraph, showOrders, setShowGraph }} />
      <CreateStrategyContent
        {...{
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
        }}
      />
    </m.div>
  );
};
