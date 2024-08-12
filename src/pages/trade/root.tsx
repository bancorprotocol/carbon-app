import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { usePersistLastPair } from 'pages/strategies/create/usePersistLastPair';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { StrategyProvider } from 'hooks/useStrategies';
import { useGetPairStrategies } from 'libs/queries';
import { TradeProvider } from 'components/trade/TradeContext';

const url = '/trade';
export const TradeRoot = () => {
  const { base, quote } = usePersistLastPair(url);
  const strategiesQuery = useGetPairStrategies({
    token0: base?.address,
    token1: quote?.address,
  });

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
      <div className="flex flex-col gap-20 p-20 md:grid md:grid-cols-[450px_auto] md:grid-rows-[40px_650px_auto]">
        <header role="menubar" className="col-span-2 flex gap-8">
          <TokenSelection base={base} quote={quote} />
        </header>
        <StrategyProvider query={strategiesQuery}>
          <Outlet />
        </StrategyProvider>
      </div>
    </TradeProvider>
  );
};
