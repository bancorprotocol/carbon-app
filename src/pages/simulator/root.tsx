import { Outlet, useNavigate, useSearch } from '@tanstack/react-router';
import { ReactComponent as IconBookmark } from 'assets/icons/bookmark.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { differenceInWeeks } from 'date-fns';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { getLastVisitedPair } from 'libs/routing';
import { useToken } from 'hooks/useTokens';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

// TODO: merge this hook with trade when they both use base / quote in search
const usePersistLastPair = () => {
  const search = useSearch({ from: '/simulate' });
  const defaultPair = useMemo(() => getLastVisitedPair(), []);
  const base = useToken(search.baseToken ?? defaultPair.base);
  const quote = useToken(search.quoteToken ?? defaultPair.quote);

  useEffect(() => {
    if (!search.baseToken || !search.quoteToken) return;
    lsService.setItem('tradePair', [search.baseToken, search.quoteToken]);
  }, [search.baseToken, search.quoteToken]);

  const navigate = useNavigate({ from: '/simulate' });
  useEffect(() => {
    if (search.baseToken && search.quoteToken) return;
    navigate({
      search: {
        ...search,
        baseToken: defaultPair.base,
        quoteToken: defaultPair.quote,
      },
      replace: true,
    });
  }, [search, navigate, defaultPair.base, defaultPair.quote]);

  return {
    base: base.token,
    quote: quote.token,
    isPending: base.isPending || quote.isPending,
  };
};

export const SimulatorRoot = () => {
  const { isPending } = usePersistLastPair();

  if (isPending) {
    return <CarbonLogoLoading className="h-80 place-self-center p-16" />;
  }

  return (
    <div className="mx-auto flex flex-col content-start gap-24 max-w-[800px] xl:max-w-[1920px] p-16 w-full">
      <SimulatorDisclaimer />
      <div className="grid content-start gap-16 2xl:grid-cols-[350px_1fr]">
        <div className="2xl:grid xl:flex xl:justify-between grid gap-16 content-start">
          {/** TODO: put back the no Price history warning */}
          <TokenSelection url="/simulate" />
          <SimInputStrategyType />
        </div>
        <div className="xl:grid xl:grid-cols-[auto_450px] gap-16 flex flex-col-reverse">
          <Outlet />
        </div>
      </div>
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
      className="flex gap-16 items-start border border-warning rounded-2xl bg-warning/10 px-24 py-16 md:col-span-2"
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
