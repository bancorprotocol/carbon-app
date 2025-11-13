import { useState } from 'react';
import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { useWagmi, Connector } from 'libs/wagmi';
import { ModalWalletError } from 'libs/modals/modals/WalletModal/ModalWalletError';
import { ModalWalletContent } from 'libs/modals/modals/WalletModal/ModalWalletContent';
import { Modal } from 'libs/modals/Modal';
import { useStore } from 'store';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect } = useWagmi();
  const { isCountryBlocked } = useStore();

  const [selectedConnection, setSelectedConnection] =
    useState<Connector | null>(null);
  const [connectionError, setConnectionError] = useState('');

  const isPending = selectedConnection !== null && !connectionError;
  const isError = selectedConnection !== null && connectionError;

  const onClickConnect = async (c: Connector) => {
    setSelectedConnection(c);
    try {
      if (isCountryBlocked || isCountryBlocked === null) {
        throw new Error('Your country is restricted from using this app.');
      }
      if (c.id === 'walletConnect') {
        closeModal(id);
        await connect(c);
      } else {
        await connect(c);
        closeModal(id);
      }
    } catch (e: any) {
      setConnectionError(e.message || 'Unknown connection error.');
    }
  };

  const onClickReturn = () => {
    setSelectedConnection(null);
    setConnectionError('');
  };

  return (
    <Modal id={id} className="overflow-clip">
      {isPending && (
        <div className="statusBar bg-primary/25 absolute inset-x-0 top-0 h-6" />
      )}
      <h2>Connect Wallet</h2>
      {isError ? (
        <div className="flex flex-col items-center gap-16">
          <ModalWalletError
            logoUrl={selectedConnection.icon}
            walletName={selectedConnection.name}
            onClick={onClickReturn}
            error={connectionError}
          />
        </div>
      ) : (
        <ModalWalletContent onClick={onClickConnect} isPending={isPending} />
      )}
    </Modal>
  );
};
