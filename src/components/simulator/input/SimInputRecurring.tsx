import { BuySellBlock } from 'components/simulator/input/BuySellBlockNew';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
} from 'components/strategies/utils';
import {
  StrategyInputValues,
  StrategyInputDispatch,
} from 'hooks/useStrategyInput';
import { CandlestickData } from 'libs/d3';
import { Token } from 'libs/tokens';

const buyWarningMsg = (base: Token) => {
  return `The specified buy price for ${base.symbol} is higher than its initial price of the simulation. As a result, your buy budget will be arbitrated in this initial step, potentially impacting the overall ROI calculation.`;
};
const sellWarningMsg = (base: Token) => {
  return `The specified sell price for ${base.symbol} is lower than its initial price of the simulation. As a result, your sell budget will be arbitrated in this initial step, potentially impacting the overall ROI calculation.`;
};

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
    return <p>error no tokens found</p>;
  }

  const showBuyWarning = firstHistoricPricePoint?.low
    ? firstHistoricPricePoint.high < +state.buy.min
    : false;
  const showSellWarning = firstHistoricPricePoint?.high
    ? firstHistoricPricePoint.low > +state.sell.max
    : false;

  const warningMsg = {
    buy: showBuyWarning ? buyWarningMsg(state.baseToken) : undefined,
    sell: showSellWarning ? sellWarningMsg(state.baseToken) : undefined,
  };

  return (
    <>
      <BuySellBlock
        buy={false}
        base={state.baseToken}
        quote={state.quoteToken}
        order={state.sell}
        dispatch={dispatch}
        isOrdersOverlap={checkIfOrdersOverlap(state.buy, state.sell)}
        isOrdersReversed={checkIfOrdersReversed(state.buy, state.sell)}
        strategyType="recurring"
        isBudgetOptional={+state.sell.budget === 0 && +state.buy.budget > 0}
        warningMsg={warningMsg.sell}
      />

      <BuySellBlock
        buy
        base={state.baseToken}
        quote={state.quoteToken}
        order={state.buy}
        dispatch={dispatch}
        isOrdersOverlap={checkIfOrdersOverlap(state.buy, state.sell)}
        isOrdersReversed={checkIfOrdersReversed(state.buy, state.sell)}
        strategyType="recurring"
        isBudgetOptional={+state.buy.budget === 0 && +state.sell.budget > 0}
        warningMsg={warningMsg.buy}
      />
    </>
  );
};
