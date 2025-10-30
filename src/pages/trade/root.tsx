import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { TradeProvider } from 'components/trade/TradeProvider';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { TradeNav } from 'components/trade/TradeNav';
import { usePersistLastPair } from 'hooks/usePersistLastPair';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/root.module.css';

export const TradeRoot = () => {
  const { base, quote, isPending } = usePersistLastPair({ from: '/trade' });

  if (isPending) {
    return <CarbonLogoLoading className="h-80 place-self-center" />;
  }
  if (!base || !quote) {
    return (
      <NotFound
        variant="error"
        title="Token not found"
        text="Could not found base or quote token"
      />
    );
  }
  return (
    <TradeProvider base={base} quote={quote}>
      <div
        className={cn(
          style.root,
          'mx-auto grid w-full gap-16 p-16 max-w-[1920px]',
        )}
      >
        <div className="2xl:grid lg:flex grid gap-16 self-start grid-area-[nav] 2xl:sticky top-[96px]">
          <TokenSelection url="/trade" />
          <TradeNav />
        </div>
        <Outlet />
      </div>
    </TradeProvider>
  );
};
