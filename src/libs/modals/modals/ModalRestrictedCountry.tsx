import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { lsService } from 'services/localeStorage';

export const ModalRestrictedCountry: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();

  const onClose = () => {
    lsService.setItem('hasSeenRestrictedCountryModal', true);
    closeModal(id);
  };

  return (
    <Modal id={id} onClose={onClose}>
      <div className={'mt-40'}>
        <IconTitleText
          variant={'warning'}
          icon={<IconWarning />}
          title={'Limited access in your location'}
          text={
            'According to our Terms of Service, users in your location are not able to use this site.'
          }
        />
      </div>
      <Button variant={'white'} fullWidth onClick={onClose} className={'mt-16'}>
        I Understand
      </Button>
    </Modal>
  );
};
