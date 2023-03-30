import { useEffect, useState } from 'react';
import { m } from 'libs/motion';
import { list } from './variants';
import { useCreateStrategy } from './useCreateStrategy';
import { CreateStrategyHeader } from './CreateStrategyHeader';
import { CreateStrategyContent } from './CreateStrategyContent';
import { MakeGenerics, useSearch } from 'libs/routing';
import { useTokens } from 'hooks/useTokens';
import { pairsToExchangeMapping } from 'components/tradingviewChart/utils';

export type StrategyType = 'reoccurring' | 'disposable';
export type StrategyDirection = 'buy' | 'sell';
export type StrategySettings = 'limit' | 'range' | 'custom';

type StrategyCreateLocationGenerics = MakeGenerics<{
  Search: {
    base: string;
    quote: string;
    strategyType: StrategyType;
    strategyDirection: StrategyDirection;
    strategySettings: StrategySettings;
  };
}>;

const handleStrategySettings = (
  strategySettings?: StrategySettings,
  functions?: ((value: boolean) => void)[]
) => {
  if (!functions || !strategySettings) {
    return;
  }

  switch (strategySettings) {
    case 'limit': {
      functions.forEach((fn) => fn(false));
      break;
    }
    case 'range': {
      functions.forEach((fn) => fn(true));
      break;
    }
    case 'custom': {
      functions.forEach((fn, i) => fn(i % 2 === 0));
      break;
    }
  }
};

function handleStrategyDirection(
  strategyDirection: 'buy' | 'sell' | undefined,
  strategySettings: 'limit' | 'range' | 'custom' | undefined,
  order1: {
    setIsRange: (value: ((prevState: boolean) => boolean) | boolean) => void;
  },
  order0: {
    setIsRange: (value: ((prevState: boolean) => boolean) | boolean) => void;
  }
) {
  switch (strategyDirection) {
    case 'buy':
      handleStrategySettings(strategySettings, [order1.setIsRange]);
      break;
    case 'sell': {
      handleStrategySettings(strategySettings, [order0.setIsRange]);
      break;
    }
  }
}

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
    isDuplicate,
  } = useCreateStrategy();

  const search = useSearch<StrategyCreateLocationGenerics>();
  const {
    base: baseAddress,
    quote: quoteAddress,
    strategySettings,
    strategyDirection,
    strategyType,
  } = search;
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

    switch (strategyType) {
      case 'disposable': {
        handleStrategyDirection(
          strategyDirection,
          strategySettings,
          order0,
          order1
        );
        order0.resetFields();
        order1.resetFields();
        break;
      }
      case 'reoccurring': {
        handleStrategySettings(strategySettings, [
          order0.setIsRange,
          order1.setIsRange,
        ]);
        order0.resetFields();
        order1.resetFields();
        break;
      }
    }
  }, [
    getTokenById,
    baseAddress,
    quoteAddress,
    setBase,
    setQuote,
    strategyType,
    strategyDirection,
    strategySettings,
    order1,
    order0,
  ]);

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
          strategyDirection,
          strategySettings,
          strategyType,
          isDuplicate,
        }}
      />
    </m.div>
  );
};
