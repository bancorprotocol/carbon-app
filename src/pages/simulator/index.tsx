import { Outlet } from '@tanstack/react-router';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { simulatorInputRootRoute } from 'libs/routing/routes/sim';
import { SimulatorMobilePlaceholder } from 'components/simulator/mobile-placeholder';
import { ReactComponent as IconBookmark } from 'assets/icons/bookmark.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { useEffect, useState } from 'react';
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
    <>
      <div className="mx-auto flex w-full max-w-[1920px] flex-col content-start gap-20 p-20 md:grid md:grid-cols-[450px_auto]">
        <SimulatorDisclaimer />
        <Outlet />
      </div>
    </>
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

  const dismiss = () => {
    const now = new Date().toISOString();
    lsService.setItem('simDisclaimerLastSeen', now);
    setShowDisclaimer(false);
  };

  if (!showDisclaimer) return;

  return (
    <div className="flex gap-16 items-start border border-warning rounded bg-warning/10 px-24 py-16 md:col-span-2">
      <div className="bg-warning/40 size-48 grid place-items-center rounded-full flex-shrink-0">
        <IconBookmark className="size-24 text-warning" />
      </div>
      <div className="grid gap-8 text-14">
        <p>
          This tool analyzes historical market data under artificial conditions,
          and is <b>not indicative of future results</b>.
        </p>
        <p>
          The simulator relies on a historical price API as to which we cannot
          assure accuracy or completeness, and it assumes no gas fees. It is
          offered for informational purposes only. Future trading outcomes may
          deviate from historical or simulated results for a variety of reasons.
        </p>
        <p>
          We disclaim any responsibility or liability whatsoever for the
          quality, accuracy or completeness of the information herein, and for
          any reliance on, or use of this material in any way.
        </p>
        <p>Tax and rebase tokens are not supported.</p>
      </div>

      <button
        aria-label="accept disclaimer"
        className="p-8 rounded-full"
        onClick={dismiss}
        data-testid="clear-sim-disclaimer"
      >
        <IconClose className="size-18" />
      </button>
    </div>
  );
};
