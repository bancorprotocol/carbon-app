import { FC } from 'react';
import { useModal } from 'modals';
import { useWeb3 } from 'web3';
import { shortenString } from 'utils/helpers';
import { Button } from 'components/Button';

export const MainMenuRightWallet: FC = () => {
  const { user, disconnect } = useWeb3();
  const { openModal } = useModal();

  const onClickOpenModal = () => openModal('wallet', undefined);

  if (user) {
    return (
      <Button variant={'primary'} onClick={disconnect}>
        {shortenString(user)}
      </Button>
    );
  }

  return (
    <Button variant={'primary'} onClick={onClickOpenModal}>
      Connect
    </Button>
  );
};
