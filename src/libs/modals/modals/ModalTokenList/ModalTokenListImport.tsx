import { FC } from 'react';
import { useModal } from 'hooks/useModal';
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
      <span className="font-medium text-white"> import a new token.</span>
    </>
  );

  return (
    <div className="mt-40 grid gap-16">
      <IconTitleText
        icon={<IconSearch />}
        title="Token not found"
        text={<Text />}
      />
      <Button variant="success" onClick={onClick}>
        Import Token
      </Button>
    </div>
  );
};
