import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconError } from 'assets/icons/times.svg';

import { ReactNode, useMemo } from 'react';
import { useModal } from 'hooks/useModal';
import { i18n, useTranslation } from 'libs/translations';

export type ModalGenericInfoData = {
  title: string;
  text?: string | ReactNode;
  variant?: 'warning' | 'error';
  onConfirm: Function;
  buttonLabel?: string;
};

export const ModalGenericInfo: ModalFC<ModalGenericInfoData> = ({
  id,
  data: {
    variant = 'error',
    title,
    text,
    buttonLabel = i18n.t('modals.genericInfo.actionButtons.actionButton1'),
    onConfirm,
  },
}) => {
  const { t } = useTranslation();
  const { closeModal } = useModal();

  const icon = useMemo(() => {
    switch (variant) {
      case 'warning':
        return <IconWarning />;
      case 'error':
        return <IconError />;
      default:
        return <IconWarning />;
    }
  }, [variant]);

  return (
    <Modal id={id}>
      <div className={'mt-40'}>
        <IconTitleText
          variant={variant}
          icon={icon}
          title={title}
          text={text}
        />
      </div>
      <Button
        variant={'white'}
        fullWidth
        onClick={() => {
          closeModal(id);
          onConfirm();
        }}
        className={'my-16'}
      >
        {buttonLabel}
      </Button>
      <Button
        variant={'black'}
        fullWidth
        onClick={() => closeModal(id)}
        className={'mt-16'}
      >
        {t('modals.genericInfo.actionButtons.actionButton2')}
      </Button>
    </Modal>
  );
};
