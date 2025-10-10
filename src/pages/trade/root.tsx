import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { TradeProvider } from 'components/trade/TradeProvider';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { TradeNav } from 'components/trade/TradeNav';
import { usePersistLastPair } from 'hooks/usePersistLastPair';

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
      <div className="mx-auto grid w-full content-start md:justify-center gap-16 p-16 2xl:grid-cols-[350px_1fr] max-w-[1920px]">
        <div className="2xl:grid xl:flex grid gap-16 content-start">
          <TokenSelection url="/trade" />
          <TradeNav />
        </div>
        <div className="xl:grid xl:grid-cols-[auto_450px] gap-16 flex flex-col-reverse">
          <Outlet />
        </div>
      </div>
    </TradeProvider>
  );
};
