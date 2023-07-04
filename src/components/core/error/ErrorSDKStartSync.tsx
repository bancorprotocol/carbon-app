import { useTranslation } from 'libs/translations';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const ErrorSDKStartSync = () => {
  const { t } = useTranslation();

  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={t('common.errors.error7')}
      text={t('common.errors.error8')}
      variant={'error'}
    />
  );
};
