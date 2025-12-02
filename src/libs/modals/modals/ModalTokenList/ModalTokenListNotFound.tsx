import { FC } from 'react';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import IconSearch from 'assets/icons/search.svg?react';

export const ModalTokenListNotFound: FC = () => {
  const Text = () => (
    <>
      <span>
        Unfortunately we couldn't find the token you're looking for, try
        searching for it
      </span>
      <span className="font-medium text-white"> by address.</span>
    </>
  );

  return (
    <div className="my-40 grid place-items-center">
      <IconTitleText
        title="Token not found"
        icon={<IconSearch />}
        text={<Text />}
      />
    </div>
  );
};
