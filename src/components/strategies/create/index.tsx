import { useState } from 'react';
import { m } from 'libs/motion';
import { useCreateStrategy } from './useCreateStrategy';
import { list } from './variants';
import { CreateStrategyHeader } from './createStrategyHeader';
import { CreateStrategyContent } from './CreateStrategyContent';

export const CreateStrategy = () => {
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

  const showGraphToggle = () => {
    setShowGraph((prev) => !prev);
  };

  return (
    <m.div
      className={`flex flex-col items-center space-y-20 p-20 ${
        showGraph ? 'justify-between' : 'justify-center'
      }`}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <CreateStrategyHeader {...{ showGraph, showOrders, showGraphToggle }} />
      <CreateStrategyContent
        {...{
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
        }}
      />
    </m.div>
  );
};
