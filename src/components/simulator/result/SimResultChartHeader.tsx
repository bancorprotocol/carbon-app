import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import { SimulatorType } from 'libs/routing/routes/sim';
import { SimResultChartTabs } from 'components/simulator/result/SimResultChartTabs';
import { SimResultChartDownload } from 'components/simulator/result/SimResultChartDownload';
import { SimulatorData } from 'libs/queries';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import { SimResultChartControls } from 'components/simulator/result/SimResultChartControls';

interface Props {
  data: Array<SimulatorData>;
  showSummary: boolean;
  setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
  state: StrategyInputValues;
  simulationType: SimulatorType;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

export const SimResultChartHeader = ({
  showSummary,
  setShowSummary,
  data,
  state,
  simulationType,
}: Props) => {
  const startDate = dateFormatter.format(data[0].date * 1e3);
  const endDate = dateFormatter.format(data[data.length - 1].date * 1e3);

  return (
    <section className="flex flex-wrap items-center justify-evenly gap-8 py-20 px-24 md:justify-between">
      <article className="flex items-center gap-8">
        <span className="flex h-24 w-24 items-center justify-center rounded-[12px] bg-white/10">
          <CalendarIcon className="h-12 w-12" />
        </span>
        <span
          className="justify-self-end text-14 text-white/80"
          data-testid="simulation-dates"
        >
          {startDate} - {endDate}
        </span>
      </article>
      {!showSummary && <SimResultChartControls />}
      <article className="flex flex-wrap items-center justify-center gap-8">
        <SimResultChartTabs
          setShowSummary={setShowSummary}
          showSummary={showSummary}
        />
        <SimResultChartDownload
          data={data}
          baseSymbol={state.baseToken?.symbol ?? ''}
          quoteSymbol={state.quoteToken?.symbol ?? ''}
          simulationType={simulationType ?? ''}
        />
      </article>
    </section>
  );
};
