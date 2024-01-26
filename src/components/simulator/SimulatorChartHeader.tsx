import { ReactComponent as CalendarIcon } from 'assets/icons/sim-calendar.svg';
import { SimulatorPageTabs } from './SimulatorPageTabs';
import { SimulatorDownloadMenu } from './SimulatorDownload';
import { SimulatorReturn } from 'libs/queries';

interface Props extends Pick<SimulatorReturn, 'data'> {
  showSummary: boolean;
  setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SimulatorChartHeader = ({
  showSummary,
  setShowSummary,
  data,
}: Props) => {
  const startTimestamp = data![0].date * 1e3; // ms
  const endTimestamp = data![data.length - 1].date * 1e3; // ms

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  };

  const startDate = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(
    startTimestamp
  );
  const endDate = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(
    endTimestamp
  );

  return (
    <section className="flex flex-wrap items-center justify-evenly gap-8 py-8 px-24 md:justify-between">
      <article className="flex items-center gap-8">
        <span className="h-24 w-24 items-center justify-center rounded-[12px] bg-white/10">
          <CalendarIcon className="h-12 w-12" />
        </span>
        <span className="justify-self-end text-14 text-white/80">
          {startDate} – {endDate}
        </span>
      </article>
      <article className="flex items-center gap-8">
        <SimulatorPageTabs
          setShowSummary={setShowSummary}
          showSummary={showSummary}
        />
        <SimulatorDownloadMenu data={data} />
      </article>
    </section>
  );
};
