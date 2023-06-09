import { FC } from 'react';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { Trans } from 'libs/translations';

export const ModalTokenListNotFound: FC = () => {
  const Text = () => (
    <Trans
      i18nKey={'modals.selectToken.contents.content3'}
      components={{
        bold: <span className={'font-weight-500 dark:text-white'} />,
      }}
    />
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
