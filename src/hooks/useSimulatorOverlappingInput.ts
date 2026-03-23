/* eslint-disable unused-imports/no-unused-vars */
import { StrategyInputOrder } from 'hooks/useStrategyInput';
import { SimulatorInputOverlappingSearch } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';

export interface InternalSimulatorOverlappingInput
  extends SimulatorInputOverlappingSearch {
  buyMax?: string;
  sellMin?: string;
  buyBudget?: string;
  sellBudget?: string;
  sellBudgetError?: string;
  buyBudgetError?: string;
}

export type SimulatorOverlappingInputDispatch = <
  T extends InternalSimulatorOverlappingInput,
  K extends keyof T,
>(
  key: K,
  value: T[K],
) => void;

interface Props {
  searchState: SimulatorInputOverlappingSearch;
}

export interface SimulatorInputOverlappingValues {
  base?: Token;
  quote?: Token;
  buy: Omit<StrategyInputOrder, 'isRange'>;
  sell: Omit<StrategyInputOrder, 'isRange'>;
  start?: string;
  end?: string;
  spread: string;
}
