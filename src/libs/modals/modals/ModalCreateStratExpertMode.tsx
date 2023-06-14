import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useModal } from 'hooks/useModal';
import { lsService } from 'services/localeStorage';

export type ModalCreateStratExpertModeData = {
  onConfirm?: Function;
  onClose?: (id: string) => void;
};

export const ModalCreateStratExpertMode: ModalFC<
  ModalCreateStratExpertModeData
> = ({ id, data: { onConfirm, onClose } }) => {
  const { closeModal } = useModal();
  const onClick = () => {
    onConfirm && onConfirm();
    closeModal(id);
    lsService.setItem('hasSeenCreateStratExpertMode', true);
  };

  return (
    <Modal id={id} title={'Expert Mode'} onClose={onClose}>
      <div className={'mt-40'}>
        <IconTitleText
          variant={'success'}
          icon={<IconWarning />}
          title={'Range Pricing'}
          text={
            'Range Pricing will spread the allocated budget on a bonding curve and split it across multiple price points.'
          }
        />
      </div>

      <p
        className={
          'my-20 flex w-full items-center justify-center text-12 text-warning-500'
        }
      >
        <IconWarning className={'mr-10 w-14'} />
        Only use range if you know what you are doing
      </p>

      <Button variant={'white'} fullWidth onClick={onClick}>
        Proceed with Range
      </Button>
    </Modal>
  );
};
