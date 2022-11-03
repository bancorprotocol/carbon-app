import { FC } from 'react';
import { useModal } from 'modals';
import { useWeb3 } from 'web3';
import { shortenString } from 'utils/helpers';

export const MainMenuRightWallet: FC = () => {
  const { user, disconnect } = useWeb3();
  const { openModal } = useModal();

  const onClickOpenModal = () => openModal('wallet', undefined);

  if (user) {
    return <button onClick={disconnect}>{shortenString(user)}</button>;
  }

  return (
    <button
      onClick={onClickOpenModal}
      className={'rounded-full bg-gray-600 px-6 py-2 text-white'}
    >
      Connect
    </button>
  );
};
