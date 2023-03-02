import { useState } from 'react';
import { m } from 'libs/motion';
import { list } from './variants';
import { useCreateStrategy } from './useCreateStrategy';
import { CreateStrategyHeader } from './DCreateStrategyHeader';
import { CreateStrategyContent } from './ACreateStrategyContent';

export const CreateStrategyMain = () => {
  const [showGraph, setShowGraph] = useState(false);

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
      <CreateStrategyHeader {...{ showGraph, showOrders, setShowGraph }} />
      <CreateStrategyContent
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
