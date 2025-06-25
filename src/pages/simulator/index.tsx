import { Outlet } from '@tanstack/react-router';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { simulatorInputRootRoute } from 'libs/routing/routes/sim';
import { SimulatorMobilePlaceholder } from 'components/simulator/mobile-placeholder';
import { ReactComponent as IconBookmark } from 'assets/icons/bookmark.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { FormEvent, useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { differenceInWeeks } from 'date-fns';

export const SimulatorPage = () => {
  const searchState = simulatorInputRootRoute.useSearch();

  useEffect(() => {
    if (!searchState.baseToken || !searchState.quoteToken) return;
    lsService.setItem('tradePair', [
      searchState.baseToken,
      searchState.quoteToken,
    ]);
  }, [searchState.baseToken, searchState.quoteToken]);

  const { aboveBreakpoint } = useBreakpoints();

  if (!aboveBreakpoint('md')) return <SimulatorMobilePlaceholder />;

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col content-start gap-20 p-20 md:grid md:grid-cols-[auto_450px]">
      <SimulatorDisclaimer />
      <Outlet />
    </div>
  );
};

const SimulatorDisclaimer = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const last = lsService.getItem('simDisclaimerLastSeen');
    if (!last || differenceInWeeks(new Date(), last) > 1) {
      setShowDisclaimer(true);
    }
  }, []);

  const dismiss = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = new Date().toISOString();
    lsService.setItem('simDisclaimerLastSeen', now);
    setShowDisclaimer(false);
  };

  if (!showDisclaimer) return;

  return (
    <form
      onSubmit={dismiss}
      className="flex gap-16 items-start border border-warning rounded bg-warning/10 px-24 py-16 md:col-span-2"
    >
      <div className="self-center bg-warning/40 size-48 grid place-items-center rounded-full flex-shrink-0">
        <IconBookmark className="size-24 text-warning" />
      </div>
      <hgroup className="grid gap-8 text-14">
        <h2>Simulator Disclaimer</h2>
        <p>
          This tool uses historical price data under simplified conditions and
          does not predict future results. It excludes gas fees, may lack
          accuracy or completeness, and is for informational purposes only. We
          accept no liability for its use. Tax and rebase tokens are not
          supported.
        </p>
      </hgroup>

      <button
        type="submit"
        aria-label="accept disclaimer"
        className="p-8 rounded-full"
        data-testid="clear-sim-disclaimer"
      >
        <IconClose className="size-18" />
      </button>
    </form>
  );
};
