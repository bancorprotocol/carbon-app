import { FC, ReactNode, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradingviewChart } from 'components/tradingviewChart';
import { CreateStrategyGraph } from './CreateStrategyGraph';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { items, list } from './variants';
import { m } from 'libs/motion';
import { Token } from 'libs/tokens';
import { useRouter } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { carbonEvents } from 'services/events';

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
          showGraph ? '' : 'md:w-[480px] md:justify-self-center'
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
          <button
            onClick={() => history.back()}
            className="bg-background-800 grid size-40 place-items-center rounded-full"
          >
            <ForwardArrow className="size-18 rotate-180" />
          </button>
          <h1 className="text-24 font-weight-500 flex-1">Set Prices</h1>
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
        </m.header>

        <div className="flex flex-col gap-20 md:flex-row-reverse md:justify-center">
          {showGraph && (
            <CreateStrategyGraph setShowGraph={setShowGraph}>
              {graph}
            </CreateStrategyGraph>
          )}
          {children}
        </div>
      </m.div>
    </AnimatePresence>
  );
};
