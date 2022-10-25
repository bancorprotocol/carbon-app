import { FC } from 'react';
import { useModal } from 'modals/index';
import { useWeb3 } from 'providers/Web3Provider';
import { shortenString } from 'utils/helpers';

export const MainMenuRightWallet: FC = () => {
  const { user, disconnect } = useWeb3();
  const { openModal } = useModal();

  const onOpenModalClick = () => openModal('wallet', undefined);

  if (user) {
    return <button onClick={disconnect}>{shortenString(user)}</button>;
  }

  return (
    <button
      onClick={onOpenModalClick}
      className={'rounded-full bg-gray-600 px-6 py-2 text-white'}
    >
      Connect
    </button>
  );
};
