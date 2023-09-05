import { carbonEvents } from 'services/events';
import { useLocation } from 'libs/routing';
import { EditTypes } from './EditStrategyMain';
import { ForwardArrow } from 'components/common/forwardArrow';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';

type EditStrategyHeaderProps = {
  showGraph: boolean;
  setShowGraph: (value: boolean) => void;
  type: EditTypes | undefined;
};

export const EditStrategyHeader = ({
  showGraph,
  setShowGraph,
  type,
}: EditStrategyHeaderProps) => {
  const {
    history: { back },
  } = useLocation();

  const titleByType: { [key in EditTypes]: string } = {
    renew: 'Renew Strategy',
    editPrices: 'Edit Prices',
    deposit: 'Deposit Budget',
    withdraw: 'Withdraw Budget',
  };

  return (
    <div
      className={`flex w-full flex-row justify-between ${
        showGraph ? '' : 'md:w-[400px]'
      }`}
    >
      <div className="flex items-center gap-16 text-24">
        <button
          onClick={() => back()}
          className="h-40 w-40 rounded-full bg-emphasis"
        >
          <div className="rotate-180">
            <ForwardArrow className="mx-auto w-14" />
          </div>
        </button>
        {type && titleByType[type]}
      </div>
      {!showGraph && (
        <button
          onClick={() => {
            carbonEvents.strategy.strategyChartOpen(undefined);
            setShowGraph(true);
          }}
          className="h-40 w-40 self-end rounded-full bg-emphasis"
        >
          <IconCandles className="mx-auto w-14" />
        </button>
      )}
    </div>
  );
};
