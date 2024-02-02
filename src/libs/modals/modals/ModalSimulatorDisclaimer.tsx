import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconBookmark } from 'assets/icons/bookmark.svg';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export const ModalSimulatorDisclaimer: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();

  const paragraphClassName =
    'text-secondary flex w-full items-center justify-center text-center';

  return (
    <ModalOrMobileSheet id={id}>
      <IconTitleText
        icon={<IconBookmark className="h-24 w-24 text-white" />}
        title="Simulator Disclaimer"
      />
      <p className={paragraphClassName}>
        This tool provides insights into historical market performance, but
        results may vary due to the underlying price API. The simulator assumes
        no gas fees.
      </p>
      <p className={paragraphClassName}>
        While it offers valuable information for analyzing past market behavior,
        users should approach the results with an awareness of potential
        variations in real-world conditions. It's advisable to use this tool as
        a reference and consider multiple factors that may influence actual
        trading outcomes.
      </p>
      <Button variant="white" fullWidth onClick={() => closeModal(id)}>
        I Understand
      </Button>
    </ModalOrMobileSheet>
  );
};
