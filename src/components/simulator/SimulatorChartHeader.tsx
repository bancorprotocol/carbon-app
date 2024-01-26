import { ReactComponent as CalendarIcon } from 'assets/icons/sim-calendar.svg';
import { SimulatorPageTabs } from './SimulatorPageTabs';
import { SimulatorDownloadMenu } from './SimulatorDownload';

interface Props {
  showSummary: boolean;
  setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SimulatorChartHeader = ({
  showSummary,
  setShowSummary,
}: Props) => {
  return (
    <section className="flex flex-wrap items-center justify-evenly gap-8 py-8 px-24 md:justify-between">
      <article className="flex items-center gap-8">
        <CalendarIcon className="h-24 w-24" />
        <span className="justify-self-end text-14 text-white/80">
          Dec 13, 2023 – Jan 26, 2024
        </span>
      </article>
      <article className="flex items-center gap-8">
        <SimulatorPageTabs
          setShowSummary={setShowSummary}
          showSummary={showSummary}
        />
        <SimulatorDownloadMenu />
      </article>
    </section>
  );
};
