import { ModalFC } from 'libs/modals/modals.types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { lsService } from 'services/localeStorage';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import { useCallback } from 'react';
import { useModal } from 'hooks/useModal';

export const ModalRestrictedCountry: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const onClose = useCallback(() => {
    closeModal(id);
    lsService.setItem('hasSeenRestrictedCountryModal', true);
  }, [closeModal, id]);

  return (
    <Modal id={id} onClose={onClose} className="grid gap-16">
      <ModalHeader id={id} />
      <IconTitleText
        variant="warning"
        icon={<IconWarning />}
        title="Limited access in your location"
        text="According to our Terms of Service, users in your location are not able to use this site."
      />
      <button className="btn-on-surface" onClick={onClose}>
        I Understand
      </button>
    </Modal>
  );
};
