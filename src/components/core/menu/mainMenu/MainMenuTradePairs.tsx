import { TokensOverlap } from 'components/common/tokensOverlap';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { Button } from 'components/common/button';
import { useTradePairs } from 'components/trade/useTradePairs';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { carbonEvents } from 'services/events';

type Props = {
  baseToken: Token;
  quoteToken: Token;
};

export const MainMenuTradePairs: FC<Props> = ({ baseToken, quoteToken }) => {
  const { openTradePairList } = useTradePairs();

  return (
    <Button
      variant={'secondary'}
      onClick={() => {
        openTradePairList();
        carbonEvents.trade.tradePairChangeClick({
          buyToken: baseToken,
          sellToken: quoteToken,
        });
      }}
      className={
        'flex items-center rounded-full bg-silver py-5 ps-15 pe-15 space-s-10'
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
