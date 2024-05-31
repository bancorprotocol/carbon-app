import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { useRouter } from 'libs/routing';
import { items } from 'components/strategies/create/variants';
import { ForwardArrow } from 'components/common/forwardArrow';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { Dispatch, FC } from 'react';

interface Props {
  showGraph: boolean;
  setShowGraph: Dispatch<boolean>;
}

export const CreateStrategyHeader: FC<Props> = (props) => {
  const { showGraph, setShowGraph } = props;
  const { history } = useRouter();
  return (
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
  );
};
