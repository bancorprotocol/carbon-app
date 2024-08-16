import { FC, ReactNode, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { m } from 'libs/motion';
import { Token } from 'libs/tokens';
import { useRouter } from '@tanstack/react-router';
import { carbonEvents } from 'services/events';
import { StrategyGraph } from 'components/strategies/common/StrategyGraph';
import { items, list } from 'components/strategies/common/variants';
import { BackButton } from 'components/common/BackButton';

interface Props {
  base?: Token;
  quote?: Token;
  graph?: ReactNode;
  children: ReactNode;
}

export const CreateLayout: FC<Props> = (props) => {
  const { base, quote, children } = props;
  const [showGraph, setShowGraph] = useState(true);
  const { history } = useRouter();

  if (!base || !quote) {
    return <CarbonLogoLoading className="h-[100px] place-self-center" />;
  }

  const graph = props.graph ?? <TradingviewChart base={base} quote={quote} />;

  return (
    <AnimatePresence mode="sync">
      <m.div
        className={`flex flex-col gap-20 p-20 ${
          showGraph ? '' : 'md:justify-self-center'
        }`}
        variants={list}
        initial="hidden"
        animate="visible"
      >
        <m.header
          variants={items}
          key="createStrategyHeader"
          className="flex items-center gap-16"
        >
          <BackButton onClick={() => history.back()} />
          <h1 className="text-24 font-weight-500 flex-1">Set Prices</h1>
          {!showGraph && (
            <button
              onClick={() => {
                carbonEvents.strategy.strategyChartOpen(undefined);
                setShowGraph(true);
              }}
              data-testid="open-chart"
              className="bg-background-800 hover:border-background-700 border-background-800 grid size-40 place-items-center rounded-full border-2"
            >
              <IconCandles className="size-18" />
            </button>
          )}
        </m.header>

        <div className="flex flex-col gap-20 md:flex-row-reverse md:justify-center">
          {showGraph && (
            <StrategyGraph setShowGraph={setShowGraph}>{graph}</StrategyGraph>
          )}
          {children}
        </div>
      </m.div>
    </AnimatePresence>
  );
};
