import { useState } from 'react';
import { useModal } from 'hooks/useModal';
import { ModalProps } from 'libs/modals/modals.types';
import { useWagmi, Connector } from 'libs/wagmi';
import { ModalWalletError } from 'libs/modals/modals/WalletModal/ModalWalletError';
import { ModalWalletContent } from 'libs/modals/modals/WalletModal/ModalWalletContent';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import { useStore } from 'store';

export default function ModalWallet({ id }: ModalProps) {
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
    <Modal id={id} className="grid gap-16 relative overflow-clip">
      {isPending && (
        <div className="statusBar bg-primary/25 absolute inset-x-0 top-0 h-6" />
      )}
      <ModalHeader id={id}>
        <h2>Connect Wallet</h2>
      </ModalHeader>
      {isError ? (
        <ModalWalletError
          logoUrl={selectedConnection.icon}
          walletName={selectedConnection.name}
          onClick={onClickReturn}
          error={connectionError}
        />
      ) : (
        <ModalWalletContent onClick={onClickConnect} isPending={isPending} />
      )}
    </Modal>
  );
}
