import { useModal } from 'modals/ModalProvider';
import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { ConnectionType, useWeb3 } from 'web3';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect } = useWeb3();

  const onClickConnect = async (type: ConnectionType) => {
    try {
      await connect(type);
      closeModal(id);
    } catch (e) {
      console.error(`Modal Wallet onClickConnect error: `, e);
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

        <button onClick={() => onClickConnect(ConnectionType.INJECTED)}>
          Connect to MetaMask
        </button>
      </div>
    </Modal>
  );
};
