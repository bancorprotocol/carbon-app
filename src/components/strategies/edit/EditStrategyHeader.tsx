import { carbonEvents } from 'services/events';
import { EditTypes } from './EditStrategyMain';
import { useRouter } from 'libs/routing';
import { ForwardArrow } from 'components/common/forwardArrow';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { cn } from 'utils/helpers';

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
  const { history } = useRouter();
  const titleByType: { [key in EditTypes]: string } = {
    renew: 'Renew Strategy',
    editPrices: 'Edit Prices',
    deposit: 'Deposit Budget',
    withdraw: 'Withdraw Budget',
  };

  return (
    <header
      className={cn(
        'flex w-full items-center gap-16',
        showGraph ? '' : 'md:w-[400px]'
      )}
    >
      <button
        onClick={() => history.back()}
        className="grid h-40 w-40 place-items-center rounded-full bg-emphasis"
      >
        <ForwardArrow className="h-18 w-18 rotate-180" />
      </button>
      <h1 className="flex-1 text-24 font-weight-500">
        {type && titleByType[type]}
      </h1>
      {!showGraph && (
        <button
          onClick={() => {
            carbonEvents.strategy.strategyChartOpen(undefined);
            setShowGraph(true);
          }}
          className="grid h-40 w-40 place-items-center rounded-full bg-emphasis"
        >
          <IconCandles className="h-18 w-18" />
        </button>
      )}
    </header>
  );
};
