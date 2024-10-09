import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconBookmark } from 'assets/icons/bookmark.svg';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export interface ModalSimulatorDisclaimerData {
  onConfirm: () => void;
}

export const ModalSimulatorDisclaimer: ModalFC<
  ModalSimulatorDisclaimerData
> = ({ id, data: { onConfirm } }) => {
  const { closeModal } = useModal();

  const paragraphClassName =
    'text-white/60 text-14 flex w-full items-center justify-center text-center';

  return (
    <ModalOrMobileSheet id={id} data-testid="sim-disclaimer-modal">
      <IconTitleText
        icon={<IconBookmark className="size-24 text-white" />}
        title="Simulator Disclaimer"
      />
      <p className={paragraphClassName}>
        This tool analyzes historical market data under artificial conditions,
        and is not indicative of future results.
      </p>
      <p className={paragraphClassName}>
        The simulator relies on a historical price API as to which we cannot
        assure accuracy or completeness, and it assumes no gas fees. It is
        offered for informational purposes only. Future trading outcomes may
        deviate from historical or simulated results for a variety of reasons.
      </p>
      <p className={paragraphClassName}>
        We disclaim any responsibility or liability whatsoever for the quality,
        accuracy or completeness of the information herein, and for any reliance
        on, or use of this material in any way.
      </p>
      <p className={paragraphClassName}>
        Tax and rebase tokens are not supported.
      </p>

      <Button
        variant="success"
        fullWidth
        onClick={() => {
          onConfirm();
          closeModal(id);
        }}
        data-testid="clear-sim-disclaimer"
      >
        I Understand
      </Button>
    </ModalOrMobileSheet>
  );
};
