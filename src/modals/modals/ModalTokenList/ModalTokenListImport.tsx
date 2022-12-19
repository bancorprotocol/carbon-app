import { FC } from 'react';
import { useModal } from '../../ModalProvider';
import { Button } from '../../../components/Button';

export const ModalTokenListImport: FC<{ address: string }> = ({ address }) => {
  const { openModal } = useModal();

  const onClick = () => {
    openModal('importToken', { address });
  };

  return (
    <>
      <div className={'mt-40 mb-20 flex w-full justify-center'}>
        <div className={'max-w-[276px] space-y-12 text-center'}>
          <h2>Token not found</h2>
          <p className={'text-14'}>
            Unfortunately we couldn't find a token for the address you entered,
            try
            <span className={'font-weight-600'}> to import a new token.</span>
          </p>
        </div>
      </div>
      <Button fullWidth onClick={onClick}>
        Import Token
      </Button>
    </>
  );
};
