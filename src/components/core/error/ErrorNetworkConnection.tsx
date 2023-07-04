import { useTranslation } from 'libs/translations';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const ErrorNetworkConnection = () => {
  const { t } = useTranslation();

  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={t('common.errors.error5')}
      text={t('common.errors.error6')}
      variant={'error'}
    />
  );
};
