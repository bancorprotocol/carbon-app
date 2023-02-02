import { useModal } from 'hooks/useModal';
import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { useWeb3, Connection, SELECTABLE_CONNECTION_TYPES } from 'libs/web3';
import { useState } from 'react';
import { Imager } from 'components/common/imager/Imager';
import iconLedger from 'assets/logos/ledger.svg';
import iconTrezor from 'assets/logos/trezor.svg';
import { getConnection } from 'libs/web3/web3.utils';

export const SELECTABLE_CONNECTIONS: Connection[] =
  SELECTABLE_CONNECTION_TYPES.map(getConnection);

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect } = useWeb3();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [connectionError, setConnectionError] = useState('');

  const onClickConnect = async (c: Connection) => {
    setSelectedConnection(c);
    try {
      await connect(c.type);
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
            <div className={'flex flex-col items-center space-y-20'}>
              <Imager
                alt={'Wallet Logo'}
                src={selectedConnection.logoUrl}
                className={'w-60'}
              />
              <span>{selectedConnection.name} Error:</span>
              <span
                className={
                  'rounded-10 bg-red/20 px-20 py-10 font-weight-500 text-red'
                }
              >
                {connectionError}
              </span>
            </div>
          ) : (
            <div className={'flex flex-col items-center space-y-20'}>
              <Imager
                alt={'Wallet Logo'}
                src={selectedConnection.logoUrl}
                className={'w-60 animate-pulse'}
              />
              <span>connecting to {selectedConnection.name} ...</span>
            </div>
          )
        ) : (
          <div className={'space-y-10'}>
            {SELECTABLE_CONNECTIONS.map((c) => (
              <button
                key={c.type}
                onClick={() => onClickConnect(c)}
                className={
                  'flex h-44 w-full items-center space-x-16 rounded-8 px-10 hover:bg-black'
                }
              >
                <Imager
                  alt={'Wallet Logo'}
                  src={c.logoUrl}
                  className={'w-24'}
                />
                <span className={'text-16 font-weight-500'}>{c.name}</span>
              </button>
            ))}

            <a
              href={
                'https://www.ledger.com/academy/security/the-safest-way-to-use-metamask'
              }
              target={'_blank'}
              rel="noreferrer"
              className={
                'flex h-44 w-full items-center space-x-16 rounded-8 px-10 hover:bg-black'
              }
            >
              <Imager alt={'Wallet Logo'} src={iconLedger} className={'w-24'} />
              <span className={'text-16 font-weight-500'}>Ledger</span>
            </a>

            <a
              href={'https://trezor.io/learn/a/metamask-and-trezor'}
              target={'_blank'}
              rel="noreferrer"
              className={
                'flex h-44 w-full items-center space-x-16 rounded-8 px-10 hover:bg-black'
              }
            >
              <Imager
                alt={'Wallet Logo'}
                src={iconTrezor}
                className={'mx-3 w-18'}
              />
              <span className={'text-16 font-weight-500'}>Trezor</span>
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};
