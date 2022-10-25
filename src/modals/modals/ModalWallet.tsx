import { useModal } from 'modals/ModalProvider';
import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { ConnectionType, getConnection } from 'services/web3/index';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();

  const connect = async (type: ConnectionType) => {
    const { connector, name } = getConnection(type);
    try {
      await connector.activate();
      closeModal(id);
    } catch (e) {
      console.error(`failed to connect to ${name} with error: `, e);
    }
  };

  return (
    <Modal id={id}>
      <div className={'space-y-20'}>
        <button
          className={'bg-sky-500 px-2 text-white'}
          onClick={() => closeModal(id)}
        >
          close
        </button>
        <div>MODAL WALLET</div>

        <button onClick={() => connect(ConnectionType.INJECTED)}>
          Connect to MetaMask
        </button>
      </div>
    </Modal>
  );
};
