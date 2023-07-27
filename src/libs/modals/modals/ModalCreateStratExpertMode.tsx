import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useModal } from 'hooks/useModal';
import { lsService } from 'services/localeStorage';
import { useTranslation } from 'libs/translations';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalCreateStratExpertModeData = {
  onConfirm?: Function;
  onClose?: (id: string) => void;
};

export const ModalCreateStratExpertMode: ModalFC<
  ModalCreateStratExpertModeData
> = ({ id, data: { onConfirm, onClose } }) => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const onClick = () => {
    onConfirm && onConfirm();
    closeModal(id);
    lsService.setItem('hasSeenCreateStratExpertMode', true);
  };

  return (
    <ModalOrMobileSheet
      id={id}
      title={t('modals.expertMode.modalTitle')}
      onClose={onClose}
    >
      <div className={'mt-40'}>
        <IconTitleText
          variant={'success'}
          icon={<IconWarning />}
          title={t('modals.expertMode.title')}
          text={t('modals.expertMode.contents.content1')}
        />
      </div>

      <p
        className={
          'my-20 flex w-full items-center justify-center text-12 text-warning-500'
        }
      >
        <IconWarning className={'mr-10 w-14'} />
        {t('modals.expertMode.contents.content2')}
      </p>

      <Button variant={'white'} fullWidth onClick={onClick}>
        {t('modals.expertMode.actionButtons.actionButton1')}
      </Button>
    </ModalOrMobileSheet>
  );
};
