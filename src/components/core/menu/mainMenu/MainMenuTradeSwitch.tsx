import { FC } from 'react';
import { ReactComponent as IconSwitch } from 'assets/icons/switch.svg';
import { Button } from 'components/common/button';
import { Token } from 'libs/tokens';
import { useNavigate } from 'libs/routing';
import { PathNames } from 'libs/routing';
import { carbonEvents } from 'services/events';

type Props = {
  baseToken: Token;
  quoteToken: Token;
};

export const MainMenuTradeSwitch: FC<Props> = ({ baseToken, quoteToken }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate({
      to: PathNames.trade,
      search: { base: quoteToken.address, quote: baseToken.address },
    });
    carbonEvents.trade.tradePairSwap({
      buyToken: quoteToken,
      sellToken: baseToken,
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
