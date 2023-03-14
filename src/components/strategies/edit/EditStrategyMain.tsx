import { useState } from 'react';
import { m } from 'libs/motion';
import { EditStrategyHeader } from './EditStrategyHeader';
import { useCreateStrategy } from '../create/useCreateStrategy';
import { EditStrategyContent } from './EditStrategyContent';
import { list } from '../create/variants';
import { MakeGenerics, useSearch } from '@tanstack/react-location';

export type EditStrategyLocationGenerics = MakeGenerics<{
  Search: {
    strategy: any;
    type: 'renew' | 'changeRates' | 'deposit' | 'withdraw';
  };
}>;

export const EditStrategyMain = () => {
  const [showGraph, setShowGraph] = useState(false);
  const search = useSearch<EditStrategyLocationGenerics>();
  const { strategy, type } = search;

  const {
    token0,
    token1,
    setToken0,
    setToken1,
    openTokenListModal,
    showOrders,
    order0,
    order1,
    createStrategy,
    isCTAdisabled,
    token0BalanceQuery,
    token1BalanceQuery,
  } = useCreateStrategy();

  return (
    <m.div
      className={`flex flex-col items-center space-y-20 p-20 ${
        showGraph ? 'justify-between' : 'justify-center'
      }`}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <EditStrategyHeader {...{ showGraph, showOrders, setShowGraph }} />
      <EditStrategyContent
        {...{
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
          openTokenListModal,
          token0BalanceQuery,
          token1BalanceQuery,
        }}
      />
    </m.div>
  );
};
