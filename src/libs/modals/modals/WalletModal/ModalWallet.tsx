import { useState } from 'react';
import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { useWagmi, Connector } from 'libs/wagmi';
import { ModalWalletError } from 'libs/modals/modals/WalletModal/ModalWalletError';
import { ModalWalletContent } from 'libs/modals/modals/WalletModal/ModalWalletContent';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect } = useWagmi();
  const [selectedConnection, setSelectedConnection] =
    useState<Connector | null>(null);
  const [connectionError, setConnectionError] = useState('');

  const isPending = selectedConnection !== null && !connectionError;
  const isError = selectedConnection !== null && connectionError;

  const onClickConnect = async (c: Connector) => {
    setSelectedConnection(c);
    try {
      await connect(c);
      closeModal(id);
    } catch (e: any) {
      setConnectionError(e.message || 'Unknown connection error.');
    }
  };

  const onClickReturn = () => {
    setSelectedConnection(null);
    setConnectionError('');
  };

  return (
    <ModalOrMobileSheet id={id} title="Connect Wallet" isPending={isPending}>
      {isError ? (
        <div className="flex flex-col items-center space-y-20">
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
    </ModalOrMobileSheet>
  );
};
