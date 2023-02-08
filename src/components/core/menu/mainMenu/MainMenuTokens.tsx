import { useTrade } from 'components/trade/useTrade';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { Button } from 'components/common/button';

export const MainMenuTokens = () => {
  const { baseToken, quoteToken, isTradePage, openTradePairList } = useTrade();

  if (!isTradePage || !baseToken || !quoteToken) return null;

  return (
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
  );
};
