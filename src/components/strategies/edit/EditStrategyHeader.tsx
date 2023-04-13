import { useLocation } from 'libs/routing';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { EditTypes } from './EditStrategyMain';
import { carbonEvents } from 'services/events';

export const titleByType: { [key in EditTypes]: string } = {
  renew: 'Renew Strategy',
  editPrices: 'Edit Prices',
  deposit: 'Deposit Budget',
  withdraw: 'Withdraw Budget',
};

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
          <IconChevron className="mx-auto w-14 rotate-90" />
        </button>
        {(type && titleByType[type]) || ''}
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
