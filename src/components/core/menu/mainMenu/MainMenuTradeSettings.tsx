import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { ReactComponent as IconCog } from 'assets/icons/cog.svg';
import { Button } from 'components/common/button';
import { carbonEvents } from 'services/events';

import { Token } from 'libs/tokens';

type Props = {
  base: Token;
  quote: Token;
};

export const MainMenuTradeSettings: FC<Props> = ({ base, quote }) => {
  const { openModal } = useModal();

  return (
    <Button
      aria-haspopup="dialog"
      variant="secondary"
      className="flex w-40 items-center justify-center p-0"
      onClick={() => {
        openModal('tradeSettings', { base, quote });
        carbonEvents.trade.tradeSettingsClick({
          buyToken: base,
          sellToken: quote,
        });
      }}
    >
      <IconCog className="size-20" />
    </Button>
  );
};
