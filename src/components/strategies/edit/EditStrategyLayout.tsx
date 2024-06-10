import { FC, ReactNode, useState } from 'react';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { useRouter } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { carbonEvents } from 'services/events';
import { useEditStrategyCtx } from './EditStrategyContext';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { StrategyGraph } from 'components/strategies/common/StrategyGraph';

interface Props {
  editType: EditTypes;
  graph?: ReactNode;
  children: ReactNode;
}

const titleByType: Record<EditTypes, string> = {
  renew: 'Renew Strategy',
  editPrices: 'Edit Prices',
  deposit: 'Deposit Budgets',
  withdraw: 'Withdraw Budgets',
};

export const EditStrategyLayout: FC<Props> = (props) => {
  const { editType, children } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const [showGraph, setShowGraph] = useState(true);
  const { history } = useRouter();

  const graph = props.graph ?? <TradingviewChart base={base} quote={quote} />;

  return (
    <div
      className={`flex flex-col gap-20 p-20 ${
        showGraph ? '' : 'md:w-[480px] md:justify-self-center'
      }`}
    >
      <header className="flex items-center gap-16">
        <button
          onClick={() => history.back()}
          className="bg-background-800 grid size-40 place-items-center rounded-full"
        >
          <ForwardArrow className="size-18 rotate-180" />
        </button>
        <h1 className="text-24 font-weight-500 flex-1">
          {titleByType[editType]}
        </h1>
        {!showGraph && (
          <button
            onClick={() => {
              carbonEvents.strategy.strategyChartOpen(undefined);
              setShowGraph(true);
            }}
            className="bg-background-800 grid size-40 place-items-center rounded-full"
          >
            <IconCandles className="size-18" />
          </button>
        )}
      </header>

      <div className="flex flex-col gap-20 md:flex-row-reverse md:justify-center">
        {showGraph && (
          <StrategyGraph setShowGraph={setShowGraph}>{graph}</StrategyGraph>
        )}
        {children}
      </div>
    </div>
  );
};
