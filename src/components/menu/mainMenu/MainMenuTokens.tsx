import { useTrade } from 'components/trade/useTrade';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';

export const MainMenuTokens = () => {
  const { baseToken, quoteToken, isTradePage, openTradePairList } = useTrade();

  if (!isTradePage || !baseToken || !quoteToken) return null;

  return (
    <button
      onClick={openTradePairList}
      className={'flex items-center space-x-10 rounded-full bg-silver p-10'}
    >
      <TokensOverlap tokens={[baseToken, quoteToken]} />
      <span>{`${baseToken.symbol}/${quoteToken.symbol}`}</span>
      <IconChevron className="w-14" />
    </button>
  );
};
