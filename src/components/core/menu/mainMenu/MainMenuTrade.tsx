import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { useTradeTokens } from 'components/trade/useTradeTokens';
import { MainMenuTradePairs } from 'components/core/menu/mainMenu/MainMenuTradePairs';
import { MainMenuTradeSwitch } from 'components/core/menu/mainMenu/MainMenuTradeSwitch';

export const MainMenuTrade = () => {
  const { baseToken, quoteToken, isTradePage } = useTradeTokens();

  if (!isTradePage || !baseToken || !quoteToken) return null;

  return (
    <header className="flex justify-between gap-8 px-10 md:px-0">
      <MainMenuTradeSwitch baseToken={baseToken} quoteToken={quoteToken} />
      <MainMenuTradePairs baseToken={baseToken} quoteToken={quoteToken} />
      <MainMenuTradeSettings baseToken={baseToken} quoteToken={quoteToken} />
    </header>
  );
};
