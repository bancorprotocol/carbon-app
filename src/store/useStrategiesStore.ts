import { Dispatch, SetStateAction, useState } from 'react';
import { Strategy } from 'libs/queries';

export interface StrategiesStore {
  strategyToEdit: Strategy | undefined;
  setStrategyToEdit: Dispatch<SetStateAction<Strategy | undefined>>;
}

export const useStrategiesStore = (): StrategiesStore => {
  const [strategyToEdit, setStrategyToEdit] = useState<Strategy | undefined>(
    undefined
  );

  return {
    strategyToEdit,
    setStrategyToEdit,
  };
};

export const defaultStrategiesStore: StrategiesStore = {
  strategyToEdit: undefined,
  setStrategyToEdit: () => {},
};
