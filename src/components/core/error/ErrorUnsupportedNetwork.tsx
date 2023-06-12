import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Button } from 'components/common/button';
import { useWeb3 } from 'libs/web3';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import { useTranslation } from 'libs/translations';

export const ErrorUnsupportedNetwork = () => {
  const { t } = useTranslation();
  const { disconnect, switchNetwork } = useWeb3();

  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={t('common.errors.error3')}
      text={t('common.errors.error4')}
      variant={'error'}
    >
      <Button variant={'white'} fullWidth onClick={switchNetwork}>
        {t('common.actionButtons.actionButton2')}
      </Button>
      <Button variant={'black'} fullWidth onClick={disconnect}>
        {t('common.actionButtons.actionButton3')}
      </Button>
    </ErrorWrapper>
  );
};
