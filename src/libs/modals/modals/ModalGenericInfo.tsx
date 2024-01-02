import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconError } from 'assets/icons/times.svg';
import { ReactNode, useMemo } from 'react';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalGenericInfoData = {
  title: string;
  text?: string | ReactNode;
  variant?: 'warning' | 'error';
  onConfirm: Function;
  buttonLabel?: string;
};

export const ModalGenericInfo: ModalFC<ModalGenericInfoData> = ({
  id,
  data: { variant = 'error', title, text, buttonLabel = 'Confirm', onConfirm },
}) => {
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
    <ModalOrMobileSheet id={id}>
      <div className="my-20">
        <IconTitleText
          variant={variant}
          icon={icon}
          title={title}
          text={text}
        />
      </div>
      <Button
        variant="white"
        fullWidth
        onClick={() => {
          closeModal(id);
          onConfirm();
        }}
      >
        {buttonLabel}
      </Button>
      <Button variant="black" fullWidth onClick={() => closeModal(id)}>
        Cancel
      </Button>
    </ModalOrMobileSheet>
  );
};
