import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { ReactComponent as IconCog } from 'assets/icons/cog.svg';

import { Token } from 'libs/tokens';

type Props = {
  base: Token;
  quote: Token;
};

export const MainMenuTradeSettings: FC<Props> = ({ base, quote }) => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      className="hover:bg-background-800 grid size-40 place-items-center rounded-full"
      aria-label="trade settings"
      aria-haspopup="dialog"
      onClick={() => openModal('tradeSettings', { base, quote })}
    >
      <IconCog className="size-20" />
    </button>
  );
};
