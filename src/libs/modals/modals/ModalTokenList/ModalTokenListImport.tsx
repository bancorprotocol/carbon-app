import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { useStore } from 'store';

export const ModalTokenListImport: FC<{ address: string }> = ({ address }) => {
  const { openModal } = useModal();
  const { innerHeight } = useStore();

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
      <div
        className={'mt-40 flex w-full flex-col items-center'}
        style={{ height: innerHeight - 218 }}
      >
        <IconTitleText
          icon={<IconSearch />}
          title={'Token not found'}
          text={<Text />}
        />
        <Button variant={'white'} onClick={onClick} className={'my-30'}>
          Import Token
        </Button>
      </div>
    </>
  );
};
