import { TokensOverlap } from 'components/common/tokensOverlap';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { Button } from 'components/common/button';
import { MainMenuSettings } from 'components/core/menu/mainMenu/MainMenuSettings';
import { useTradeTokens } from 'components/trade/useTradeTokens';
import { useTradePairs } from 'components/trade/useTradePairs';

export const MainMenuTokens = () => {
  const { baseToken, quoteToken, isTradePage } = useTradeTokens();
  const { openTradePairList } = useTradePairs();

  if (!isTradePage || !baseToken || !quoteToken) return null;

  return (
    <div className={'flex justify-between px-10 md:space-x-5 md:px-0'}>
      <Button
        variant={'secondary'}
        onClick={openTradePairList}
        className={
          'flex items-center space-x-10 rounded-full bg-silver py-5 pl-15 pr-15'
        }
      >
        <TokensOverlap tokens={[baseToken, quoteToken]} />
        <span
          className={'text-14 font-weight-500'}
        >{`${baseToken.symbol} - ${quoteToken.symbol}`}</span>
        <IconChevron className="w-14" />
      </Button>

      <MainMenuSettings />
    </div>
  );
};
