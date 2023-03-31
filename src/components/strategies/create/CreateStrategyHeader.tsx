import { useLocation } from 'libs/routing';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { UseStrategyCreateReturn } from 'components/strategies/create/useCreateStrategy';

export const CreateStrategyHeader = ({
  showGraph,
  showOrders,
  setShowGraph,
}: UseStrategyCreateReturn) => {
  const {
    history: { back },
  } = useLocation();

  return (
    <div
      className={`flex w-full flex-row justify-between ${
        showGraph ? '' : 'md:w-[440px]'
      }`}
    >
      <div className="flex items-center gap-16 text-24">
        <button
          onClick={() => back()}
          className="h-40 w-40 rounded-full bg-emphasis"
        >
          <IconChevron className="mx-auto w-14 rotate-90" />
        </button>
        Create Strategy
      </div>
      {!showGraph && showOrders && (
        <button
          onClick={() => setShowGraph(true)}
          className="h-40 w-40 self-end rounded-full bg-emphasis"
        >
          <IconCandles className="mx-auto w-14" />
        </button>
      )}
    </div>
  );
};
