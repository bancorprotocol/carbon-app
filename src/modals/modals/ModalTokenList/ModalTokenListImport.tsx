import { FC } from 'react';
import { useModal } from 'modals';
import { Button } from 'components/Button';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { IconTitleText } from 'components/IconTitleText';

export const ModalTokenListImport: FC<{ address: string }> = ({ address }) => {
  const { openModal } = useModal();

  const onClick = () => {
    openModal('importToken', { address });
  };

  const Text = () => (
    <>
      <span>
        Unfortunately we couldn't find a token for the address you entered, try
      </span>
      <span className={'font-weight-500 dark:text-white'}>
        {' '}
        to import a new token.
      </span>
    </>
  );

  return (
    <>
      <div className={'mt-40 flex w-full flex-col items-center'}>
        <IconTitleText
          icon={<IconSearch />}
          title={'Token not found'}
          text={<Text />}
        />
        <Button variant={'secondary'} onClick={onClick} className={'my-30'}>
          Import Token
        </Button>
      </div>
    </>
  );
};
