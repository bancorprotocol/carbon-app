import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { useTradeTokens } from 'components/trade/useTradeTokens';
import { MainMenuTradePairs } from 'components/core/menu/mainMenu/MainMenuTradePairs';
import { MainMenuTradeSwitch } from 'components/core/menu/mainMenu/MainMenuTradeSwitch';
import { useEffect } from 'react';
import { sendEvent } from 'services/googleTagManager';

export const MainMenuTrade = () => {
  const { baseToken, quoteToken, isTradePage } = useTradeTokens();

  useEffect(() => {
    sendEvent('trade', 'trade_pair_change', {
      token_pair: `${baseToken?.symbol}/${quoteToken?.symbol}`,
      buy_token: baseToken?.symbol || '',
      sell_token: quoteToken?.symbol || '',
    });
  }, [baseToken, quoteToken]);

  if (!isTradePage || !baseToken || !quoteToken) return null;

  return (
    <div className={'flex justify-between px-10 md:space-x-5 md:px-0'}>
      <MainMenuTradeSwitch baseToken={baseToken} quoteToken={quoteToken} />
      <MainMenuTradePairs baseToken={baseToken} quoteToken={quoteToken} />
      <MainMenuTradeSettings baseToken={baseToken} quoteToken={quoteToken} />
    </div>
  );
};
