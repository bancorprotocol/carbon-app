import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import { SimulatorPageTabs } from './SimulatorPageTabs';
import { SimulatorDownload } from './SimulatorDownload';
import { SimulatorData } from 'libs/queries';
import { StrategyInput2 } from 'hooks/useStrategyInput';
import { SimulatorControls } from './SimulatorControls';

interface Props {
  data: Array<SimulatorData>;
  showSummary: boolean;
  setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
  state: StrategyInput2;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

export const SimulatorChartHeader = ({
  showSummary,
  setShowSummary,
  data,
  state,
}: Props) => {
  const startDate = dateFormatter.format(data[0].date * 1e3);
  const endDate = dateFormatter.format(data[data.length - 1].date * 1e3);

  return (
    <section className="flex flex-wrap items-center justify-evenly gap-8 py-8 px-24 md:justify-between">
      <article className="flex items-center gap-8">
        <span className="flex h-24 w-24 items-center justify-center rounded-[12px] bg-white/10">
          <CalendarIcon className="h-12 w-12" />
        </span>
        <span className="justify-self-end text-14 text-white/80">
          {startDate} – {endDate}
        </span>
      </article>
      <SimulatorControls showSummary={showSummary} />
      <article className="flex flex-wrap items-center justify-center gap-8">
        <SimulatorPageTabs
          setShowSummary={setShowSummary}
          showSummary={showSummary}
        />
        <SimulatorDownload
          data={data}
          baseSymbol={state.baseToken?.symbol ?? ''}
          quoteSymbol={state.quoteToken?.symbol ?? ''}
          simulationType={state.simulationType ?? ''}
        />
      </article>
    </section>
  );
};
