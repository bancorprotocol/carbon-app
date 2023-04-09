import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { ReactComponent as IconCog } from 'assets/icons/cog.svg';
import { Button } from 'components/common/button';
import { carbonEvents } from 'services/googleTagManager';
import { Token } from 'libs/tokens';

type Props = {
  baseToken: Token;
  quoteToken: Token;
};

export const MainMenuTradeSettings: FC<Props> = ({ baseToken, quoteToken }) => {
  const { openModal } = useModal();

  return (
    <Button
      variant={'secondary'}
      className={'flex w-40 items-center justify-center !p-0'}
      onClick={() => {
        openModal('tradeSettings', { base: baseToken, quote: quoteToken });
        carbonEvents.trade.tradeSettingsClick({
          token_pair: `${baseToken.symbol}/${quoteToken.symbol}`,
          buy_token: baseToken.symbol,
          sell_token: quoteToken.symbol,
        });
      }}
    >
      <IconCog className={'h-20 w-20'} />
    </Button>
  );
};
