import { useTranslation } from 'libs/translations';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const ErrorTokenList = () => {
  const { t } = useTranslation();

  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={t('common.errors.error9')}
      text={t('common.errors.error10')}
      variant={'error'}
    />
  );
};
