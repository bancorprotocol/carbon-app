import dayjs from 'dayjs';
import { useModal } from 'hooks/useModal';
import { useCallback, useEffect, useRef } from 'react';
import { useStore } from 'store';

export const useSimDisclaimer = () => {
  const { simDisclaimerLastSeen, setSimDisclaimerLastSeen } = useStore();
  const { openModal } = useModal();
  const hasOpenedDisclaimer = useRef(false);

  const handleSimulatorDisclaimer = useCallback(() => {
    if (
      !!simDisclaimerLastSeen &&
      simDisclaimerLastSeen > dayjs().subtract(15, 'minutes').unix()
    ) {
      return;
    }
    if (!hasOpenedDisclaimer.current) {
      openModal('simulatorDisclaimer', {
        onConfirm: () => setSimDisclaimerLastSeen(dayjs().unix()),
      });
      hasOpenedDisclaimer.current = true;
    }
  }, [openModal, setSimDisclaimerLastSeen, simDisclaimerLastSeen]);

  useEffect(() => {
    handleSimulatorDisclaimer();
  }, [handleSimulatorDisclaimer]);
};
