import { useModal } from 'hooks/useModal';
import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { ConnectionType, useWeb3 } from 'libs/web3';
import { useState } from 'react';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect } = useWeb3();
  const [selectedConnection, setSelectedConnection] =
    useState<ConnectionType | null>(null);
  const [connectionError, setConnectionError] = useState('');

  const onClickConnect = async (type: ConnectionType) => {
    setSelectedConnection(type);
    try {
      await connect(type);
      closeModal(id);
    } catch (e: any) {
      console.error(`Modal Wallet onClickConnect error: `, e);
      setConnectionError(e.message || 'Unknown connection error.');
    }
  };

  return (
    <Modal id={id} title={'Connect Wallet'}>
      <div className={'mt-30'}>
        {selectedConnection !== null ? (
          connectionError ? (
            <div>
              <h3>Error</h3>
              <div>{connectionError}</div>
            </div>
          ) : (
            <div>
              <h3>Loading</h3>
              <div>connecting to {selectedConnection}</div>
            </div>
          )
        ) : (
          <div className={'space-y-20'}>
            <button
              onClick={() => onClickConnect(ConnectionType.INJECTED)}
              className={'w-full rounded bg-gray-100 p-16 dark:bg-darkGrey'}
            >
              MetaMask
            </button>

            <button
              onClick={() => onClickConnect(ConnectionType.WALLET_CONNECT)}
              className={'w-full rounded bg-gray-100 p-16 dark:bg-darkGrey'}
            >
              Wallet Connect
            </button>

            <button
              onClick={() => onClickConnect(ConnectionType.COINBASE_WALLET)}
              className={'w-full rounded bg-gray-100 p-16 dark:bg-darkGrey'}
            >
              Coinbase Wallet
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
