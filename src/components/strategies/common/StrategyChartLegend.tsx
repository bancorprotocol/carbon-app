import { ReactComponent as IconLock } from 'assets/icons/lock.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const StrategyChartLegend = () => {
  return (
    <footer className="text-12 flex flex-col gap-16">
      <p className="flex items-center gap-8">
        <IconLock className="size-16 shrink-0" />
        Strategy prices can only be modified when selecting "Edit Prices"
        option.
      </p>
      <p className="flex items-center gap-8">
        <span
          aria-hidden
          className="size-16 shrink-0 rounded-full bg-white/20 p-4"
        >
          <IconWarning />
        </span>
        The strategy prices shown on the chart reflect the current strategy
        settings without considering historical price changes
      </p>
    </footer>
  );
};
