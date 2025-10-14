import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { lsService } from 'services/localeStorage';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export const ModalRestrictedCountry: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();

  const onClose = () => {
    lsService.setItem('hasSeenRestrictedCountryModal', true);
    closeModal(id);
  };

  return (
    <ModalOrMobileSheet id={id} onClose={onClose}>
      <div className="mt-40">
        <IconTitleText
          variant="warning"
          icon={<IconWarning />}
          title="Limited access in your location"
          text="According to our Terms of Service, users in your location are not able to use this site."
        />
      </div>
      <button className="btn-secondary-gradient mt-16" onClick={onClose}>
        I Understand
      </button>
    </ModalOrMobileSheet>
  );
};
