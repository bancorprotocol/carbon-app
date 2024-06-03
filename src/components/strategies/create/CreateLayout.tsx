import { FC, ReactNode, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradingviewChart } from 'components/tradingviewChart';
import { CreateStrategyGraph } from './CreateStrategyGraph';
import { CreateStrategyHeader } from './CreateStrategyHeader';
import { list } from './variants';
import { m } from 'libs/motion';
import { Token } from 'libs/tokens';

interface Props {
  base?: Token;
  quote?: Token;
  graph?: ReactNode;
  children: ReactNode;
}

export const CreateLayout: FC<Props> = (props) => {
  const { base, quote, children } = props;
  const [showGraph, setShowGraph] = useState(true);

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
        <CreateStrategyHeader
          showGraph={showGraph}
          setShowGraph={setShowGraph}
        />

        <div className="flex flex-col gap-20 md:flex-row-reverse md:justify-center">
          {showGraph && (
            <CreateStrategyGraph
              showGraph={showGraph}
              setShowGraph={setShowGraph}
            >
              {graph}
            </CreateStrategyGraph>
          )}
          {children}
        </div>
      </m.div>
    </AnimatePresence>
  );
};
