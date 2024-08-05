import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { usePersistLastPair } from 'pages/strategies/create/usePersistLastPair';
import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
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
      <div className="grid grid-cols-[350px_auto] grid-rows-[40px_550px_auto] gap-20 p-20">
        <header role="menubar" className="col-span-2 flex gap-8">
          <TokenSelection base={base} quote={quote} />
          <MainMenuTradeSettings base={base} quote={quote} />
        </header>
        <StrategyProvider query={strategiesQuery}>
          <Outlet />
        </StrategyProvider>
      </div>
    </TradeProvider>
  );
};
