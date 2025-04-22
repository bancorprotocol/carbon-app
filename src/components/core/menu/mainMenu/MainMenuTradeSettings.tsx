import { useModal } from 'hooks/useModal';
import { ReactComponent as IconCog } from 'assets/icons/cog.svg';

export const MainMenuTradeSettings = () => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      className="hover:bg-background-800 grid size-40 place-items-center rounded-full"
      aria-label="trade settings"
      aria-haspopup="dialog"
      onClick={() => openModal('tradeSettings', undefined)}
    >
      <IconCog className="size-20" />
    </button>
  );
};
