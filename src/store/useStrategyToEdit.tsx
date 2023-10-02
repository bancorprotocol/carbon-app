import { Strategy } from 'libs/queries';
import { useState } from 'react';

export type StrategyToEditStore = ReturnType<typeof useStrategyToEdit>;

export const useStrategyToEdit = () => {
  // TODO clean up edit strategy
  const [strategyToEdit, setStrategyToEdit] = useState<Strategy | undefined>(
    undefined
  );
  return { strategyToEdit, setStrategyToEdit };
};

export const defaultStrategyToEdit = {
  strategyToEdit: undefined,
  setStrategyToEdit: () => undefined,
};
