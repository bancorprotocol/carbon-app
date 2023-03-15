import { useState } from 'react';
import { m } from 'libs/motion';
import { EditStrategyHeader } from './EditStrategyHeader';
import { EditStrategyLayout } from './EditStrategyLayout';
import { list } from '../create/variants';
import { MakeGenerics, useSearch } from '@tanstack/react-location';
import { Strategy } from 'libs/queries';

export type EditTypes = 'renew' | 'changeRates' | 'deposit' | 'withdraw';
export type EditStrategyLocationGenerics = MakeGenerics<{
  Search: {
    type: EditTypes;
  };
}>;

export const EditStrategyMain = ({
  strategy,
}: {
  strategy: Strategy | undefined;
}) => {
  const [showGraph, setShowGraph] = useState(true);
  const search = useSearch<EditStrategyLocationGenerics>();
  const { type } = search;

  return (
    <m.div
      className={`flex flex-col items-center space-y-20 p-20 ${
        showGraph ? 'justify-between' : 'justify-center'
      }`}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <EditStrategyHeader {...{ showGraph, setShowGraph, type }} />
      {type && strategy && (
        <EditStrategyLayout
          {...{
            strategy,
            type,
            showGraph,
            setShowGraph,
          }}
        />
      )}
    </m.div>
  );
};
