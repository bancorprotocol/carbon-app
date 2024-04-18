import { FC } from 'react';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { useStore } from 'store';

export const ModalTokenListNotFound: FC = () => {
  const { innerHeight } = useStore();

  const Text = () => (
    <>
      <span>
        Unfortunately we couldn't find the token you're looking for, try
        searching for it
      </span>
      <span className="font-weight-500 text-white"> by address.</span>
    </>
  );

  return (
    <div
      className="my-40 flex w-full flex-col items-center"
      style={{ height: innerHeight - 258 }}
    >
      <IconTitleText
        title="Token not found"
        icon={<IconSearch />}
        text={<Text />}
      />
    </div>
  );
};
