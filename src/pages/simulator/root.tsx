import { Outlet } from '@tanstack/react-router';
import { ReactComponent as IconClock } from 'assets/icons/clock.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { FormEvent, useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { differenceInWeeks } from 'date-fns';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { usePersistLastPair } from 'hooks/usePersistLastPair';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/root.module.css';

export const SimulatorRoot = () => {
  const { isPending } = usePersistLastPair({ from: '/simulate' });

  if (isPending) {
    return <CarbonLogoLoading className="h-80 place-self-center p-16" />;
  }

  return (
    <div className="mx-auto flex flex-col content-start gap-24 xl:max-w-[1920px] p-16 w-full">
      <SimulatorDisclaimer />
      <div className={cn(style.root, 'grid gap-16')}>
        <div className="2xl:grid lg:flex grid gap-16 self-start grid-area-[nav] 2xl:sticky top-[96px]">
          <TokenSelection url="/simulate" />
          <SimInputStrategyType />
        </div>
        <Outlet />
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
      className="flex gap-16 items-start border border-primary rounded-2xl bg-primary/10 p-16 md:col-span-2"
    >
      <div className="self-start bg-primary/20 size-48 grid place-items-center rounded-full flex-shrink-0">
        <IconClock className="size-24 fill-gradient" />
      </div>
      <hgroup className="grid gap-8 text-14">
        <h2>Backtest Your Trading Strategy</h2>
        <p>
          This tool is for informational purposes only and operates under
          simplified conditions. It excludes gas fees, does not support fee on
          transfer (tax) or rebase tokens, and may lack accuracy or
          completeness. Bancor accepts no liability for its use.
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
