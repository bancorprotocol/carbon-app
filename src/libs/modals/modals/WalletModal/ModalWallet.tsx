import { useEffect, useState } from 'react';
import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { useWagmi, Connector } from 'libs/wagmi';
import { ModalWalletError } from 'libs/modals/modals/WalletModal/ModalWalletError';
import { ModalWalletContent } from 'libs/modals/modals/WalletModal/ModalWalletContent';
import { carbonEvents } from 'services/events';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { useStore } from 'store';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect, user } = useWagmi();
  const [selectedConnection, setSelectedConnection] =
    useState<Connector | null>(null);
  const [connectionError, setConnectionError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { isManualConnection } = useStore();

  useEffect(() => {
    if (isConnected) {
      if (window?.OneTrust) {
        window?.OneTrust?.AllowAll();
        window?.OneTrust?.Close();
      }
      carbonEvents.wallet.walletConnect({
        address: user,
        name: selectedConnection?.name || '',
      });
    }
  }, [isConnected, selectedConnection?.name, user]);

  useEffect(() => {
    carbonEvents.wallet.walletConnectPopupView(undefined);
  }, []);

  const isLoading = selectedConnection !== null && !connectionError;
  const isError = selectedConnection !== null && connectionError;

  const onClickConnect = async (c: Connector) => {
    setSelectedConnection(c);
    try {
      await connect(c);
      closeModal(id);
      setIsConnected(true);
      isManualConnection.current = true;
    } catch (e: any) {
      console.error(`Modal Wallet onClickConnect error: `, e);
      setConnectionError(e.message || 'Unknown connection error.');
    }
  };

  return (
    <ModalOrMobileSheet id={id} title="Connect Wallet" isLoading={isLoading}>
      {isError ? (
        <div className="flex flex-col items-center space-y-20">
          <ModalWalletError
            logoUrl={selectedConnection.icon}
            name={selectedConnection.name}
            error={connectionError}
          />
        </div>
      ) : (
        <ModalWalletContent onClick={onClickConnect} isLoading={isLoading} />
      )}
    </ModalOrMobileSheet>
  );
};
