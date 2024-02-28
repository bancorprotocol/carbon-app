import { BuySellBlock } from 'components/simulator/input/BuySellBlockNew';
import { checkIfOrdersOverlapNew } from 'components/strategies/utils';
import {
  StrategyInputValues,
  StrategyInputDispatch,
} from 'hooks/useStrategyInput';
import { CandlestickData } from 'libs/d3';

const buyWarningMsg =
  'This budget will be arbitrated in the first step of the simulation, potentially affecting the overall ROI calculation.';
const sellWarningMsg =
  'This budget will be arbitrated in the first step of the simulation, potentially affecting the overall ROI calculation.';

interface Props {
  state: StrategyInputValues;
  dispatch: StrategyInputDispatch;
  firstHistoricPricePoint?: CandlestickData;
}

export const SimInputRecurring = ({
  state,
  dispatch,
  firstHistoricPricePoint,
}: Props) => {
  if (!state.baseToken || !state.quoteToken) {
    return <div>error no tokens found</div>;
  }

  const showBuyWarning = firstHistoricPricePoint?.low
    ? firstHistoricPricePoint.high < +state.buy.min
    : false;
  const showSellWarning = firstHistoricPricePoint?.high
    ? firstHistoricPricePoint.low > +state.sell.max
    : false;

  const warningMsg = {
    buy: showBuyWarning ? buyWarningMsg : undefined,
    sell: showSellWarning ? sellWarningMsg : undefined,
  };

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
        ignoreMarketPriceWarning
        warningMsg={warningMsg.sell}
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
        ignoreMarketPriceWarning
        warningMsg={warningMsg.buy}
      />
    </>
  );
};
