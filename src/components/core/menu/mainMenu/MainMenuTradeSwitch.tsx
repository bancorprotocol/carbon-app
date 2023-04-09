import { FC } from 'react';
import { ReactComponent as IconSwitch } from 'assets/icons/switch.svg';
import { Button } from 'components/common/button';
import { Token } from 'libs/tokens';
import { useNavigate } from 'libs/routing';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { PathNames } from 'libs/routing';
import { carbonEvents } from 'services/googleTagManager';

type Props = {
  baseToken: Token;
  quoteToken: Token;
};

export const MainMenuTradeSwitch: FC<Props> = ({ baseToken, quoteToken }) => {
  const navigate = useNavigate<MyLocationGenerics>();

  const onClick = () => {
    navigate({
      to: PathNames.trade,
      search: { base: quoteToken.address, quote: baseToken.address },
    });
    carbonEvents.trade.tradePairSwap({
      token_pair: `${quoteToken.symbol}/${baseToken.symbol}`,
      buy_token: quoteToken.symbol,
      sell_token: baseToken.symbol,
    });
  };

  return (
    <Button
      variant={'secondary'}
      className={'flex w-40 items-center justify-center !p-0'}
      onClick={onClick}
    >
      <IconSwitch className={'w-14'} />
    </Button>
  );
};
