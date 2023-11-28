import { useState } from 'react';
import { m } from 'libs/motion';
import { EditStrategyHeader } from './EditStrategyHeader';
import { EditStrategyLayout } from './EditStrategyLayout';
import { list } from '../create/variants';
import { Strategy } from 'libs/queries';
import { useSearch } from 'libs/routing';

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export interface EditStratgySearch {
  type: EditTypes;
}

export const EditStrategyMain = ({
  strategy,
}: {
  strategy: Strategy | undefined;
}) => {
  const [showGraph, setShowGraph] = useState(true);
  const { type }: EditStratgySearch = useSearch({ strict: false });

  return (
    <m.div
      className={`flex flex-col items-center space-y-20 p-20 ${
        showGraph ? 'justify-between' : 'justify-center'
      }`}
      variants={list}
      initial="hidden"
      animate="visible"
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
