import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { SimInputRecurring } from 'components/simulator/input/SimInputRecurring';
import { SimulatorStrategyType } from 'components/simulator/SimulatorStrategyType';
import { SimulatorTokenSelection } from 'components/simulator/SimulatorTokenSelection';
import { useStrategyInput } from 'hooks/useStrategyInput';
import { useState } from 'react';

export const SimulatorPage = () => {
  const { dispatch, state } = useStrategyInput();

  const [initBuyRange, setInitBuyRange] = useState(true);
  const [initSellRange, setInitSellRange] = useState(true);

  return (
    <>
      <h1 className="mb-16 px-20 text-24 font-weight-500">Simulate Strategy</h1>

      <div className="relative px-20">
        <SimInputChart
          state={state}
          dispatch={dispatch}
          initBuyRange={initBuyRange}
          initSellRange={initSellRange}
          setInitBuyRange={setInitBuyRange}
          setInitSellRange={setInitSellRange}
        />

        <div className="absolute top-0 w-[440px] space-y-20">
          <SimulatorTokenSelection
            base={state.baseToken}
            quote={state.quoteToken}
            dispatch={dispatch}
            setInitBuyRange={setInitBuyRange}
            setInitSellRange={setInitSellRange}
          />
          <SimulatorStrategyType strategyType={state.simulationType} />

          {state.simulationType === 'recurring' && (
            <SimInputRecurring state={state} dispatch={dispatch} />
          )}

          <Link
            to={'/simulator/result'}
            search={{
              baseToken: state.baseToken?.address || '',
              quoteToken: state.quoteToken?.address || '',
              buyMin: state.buy.min,
              buyMax: state.buy.max,
              buyBudget: state.buy.budget,
              sellMin: state.sell.min,
              sellMax: state.sell.max,
              sellBudget: state.sell.budget,
              start: state.start.toString(),
              end: state.end.toString(),
            }}
            className={buttonStyles({ fullWidth: true, size: 'lg' })}
          >
            Start Simulation
          </Link>
        </div>
      </div>
    </>
  );
};
