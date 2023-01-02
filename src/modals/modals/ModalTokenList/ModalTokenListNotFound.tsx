import { FC } from 'react';
import { IconTitleText } from 'components/iconTitleText/IconTitleText';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';

export const ModalTokenListNotFound: FC = () => {
  const Text = () => (
    <>
      <span>
        Unfortunately we couldn't find the token you're looking for, try
        searching for it
      </span>
      <span className={'font-weight-500 dark:text-white'}> by address.</span>
    </>
  );

  return (
    <div className={'my-40 flex w-full flex-col items-center'}>
      <IconTitleText
        title={'Token not found'}
        icon={<IconSearch />}
        text={<Text />}
      />
    </div>
  );
};
