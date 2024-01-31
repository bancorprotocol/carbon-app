import { BuySellBlock } from 'components/simulator/BuySellBlockNew';
import { checkIfOrdersOverlapNew } from 'components/strategies/utils';
import { StrategyInput2, StrategyInputDispatch } from 'hooks/useStrategyInput';

interface Props {
  state: StrategyInput2;
  dispatch: StrategyInputDispatch;
}

export const SimInputRecurring = ({ state, dispatch }: Props) => {
  if (!state.baseToken || !state.quoteToken) {
    return <div>error no tokens found</div>;
  }

  return (
    <>
      <BuySellBlock
        buy={false}
        base={state.baseToken}
        quote={state.quoteToken}
        order={state.sell}
        dispatch={dispatch}
        isOrdersOverlap={checkIfOrdersOverlapNew(state.buy, state.sell)}
        strategyType="recurring"
        isBudgetOptional={+state.sell.budget === 0 && +state.buy.budget > 0}
      />

      <BuySellBlock
        buy
        base={state.baseToken}
        quote={state.quoteToken}
        order={state.buy}
        dispatch={dispatch}
        isOrdersOverlap={checkIfOrdersOverlapNew(state.buy, state.sell)}
        strategyType="recurring"
        isBudgetOptional={+state.buy.budget === 0 && +state.sell.budget > 0}
      />
    </>
  );
};
