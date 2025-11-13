import { ModalFC } from 'libs/modals/modals.types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { lsService } from 'services/localeStorage';
import { Modal } from 'libs/modals/Modal';
import { useCallback } from 'react';

export const ModalRestrictedCountry: ModalFC<undefined> = ({ id }) => {
  const onClose = useCallback(() => {
    lsService.setItem('hasSeenRestrictedCountryModal', true);
  }, []);

  return (
    <Modal id={id} onClose={onClose} className="grid gap-16">
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
