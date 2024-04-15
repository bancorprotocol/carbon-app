import { carbonEvents } from 'services/events';
import { useRouter, EditTypes } from 'libs/routing';
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
    deposit: 'Deposit Budgets',
    withdraw: 'Withdraw Budgets',
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
        className="bg-background-800 grid size-40 place-items-center rounded-full"
      >
        <ForwardArrow className="size-18 rotate-180" />
      </button>
      <h1 className="text-24 font-weight-500 flex-1">
        {type && titleByType[type]}
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
  );
};
