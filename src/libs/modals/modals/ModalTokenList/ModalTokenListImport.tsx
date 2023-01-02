import { FC } from 'react';
import { useModal } from 'libs/modals/index';
import { Button } from 'components/common/button';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';

export const ModalTokenListImport: FC<{ address: string }> = ({ address }) => {
  const { openModal } = useModal();

  const onClick = () => {
    openModal('importToken', { address });
  };

  const Text = () => (
    <>
      <span>
        Unfortunately we couldn't find a token for the address you entered, try
        to
      </span>
      <span className={'font-weight-500 dark:text-white'}>
        {' '}
        import a new token.
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
