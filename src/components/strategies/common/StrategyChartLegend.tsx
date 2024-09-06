import { ReactComponent as IconLock } from 'assets/icons/lock.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const StrategyChartLegend = () => {
  return (
    <footer className="font-14 flex flex-col gap-16">
      <p className="flex items-center gap-8">
        <IconLock className="size-16 shrink-0" />
        The interactive features of this chart are available on the edit prices
        page.
      </p>
      <p className="text-warning flex items-center gap-8">
        <span
          aria-hidden
          className="bg-warning/10 size-16 shrink-0 rounded-full p-4"
        >
          <IconWarning />
        </span>
        Need a disclaimer for the range of strategy, not from day 1 of strategy
      </p>
    </footer>
  );
};
