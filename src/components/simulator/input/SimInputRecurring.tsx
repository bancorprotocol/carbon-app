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
  return `The specified buy price for ${base.symbol} is higher than its initial price of the simulation. This means your buy budget may be used for arbitrage in the first step, which could affect the overall ROI.`;
};
const sellWarningMsg = (base: Token) => {
  return `The specified sell price for ${base.symbol} is lower than its initial price of the simulation. This means your sell budget may be used for arbitrage in the first step, which could affect the overall ROI.`;
};

interface Props {
  state: StrategyInputValues;
  dispatch: StrategyInputDispatch;
  _sP_?: CandlestickData;
}

export const SimInputRecurring = (props: Props) => {
  const { state, dispatch, _sP_ } = props;
  if (!state.baseToken || !state.quoteToken) {
    return <p>error no tokens found</p>;
  }

  const showBuyWarning = _sP_?.low ? _sP_.high < +state.buy.min : false;
  const showSellWarning = _sP_?.high ? _sP_.low > +state.sell.max : false;

  const warningMsg = {
    buy: showBuyWarning ? buyWarningMsg(state.baseToken) : undefined,
    sell: showSellWarning ? sellWarningMsg(state.baseToken) : undefined,
  };

  return (
    <>
      <BuySellBlock
        isBuy={false}
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
        isBuy
        base={state.baseToken}
        quote={state.quoteToken}
        order={state.buy}
        dispatch={dispatch}
        isOrdersOverlap={checkIfOrdersOverlap(state.buy, state.sell)}
        isOrdersReversed={checkIfOrdersReversed(state.buy, state.sell)}
        strategyType="recurring"
        isBudgetOptional={+state.buy.budget === 0 && +state.sell.budget > 0}
        warningMsg={warningMsg.buy}
        className="rounded-ee-2xl rounded-es-2xl"
      />
    </>
  );
};
