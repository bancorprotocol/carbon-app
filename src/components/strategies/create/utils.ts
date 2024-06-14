import { Dispatch, SetStateAction } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { NavigateOptions } from 'libs/routing';

export const handleTxStatusAndRedirectToOverview = (
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  navigate?: (opts: NavigateOptions) => Promise<void>
) => {
  setIsProcessing(true);
  setTimeout(() => {
    navigate?.({ to: '/', params: {}, search: {} });
    setIsProcessing(false);
  }, ONE_AND_A_HALF_SECONDS_IN_MS);
};
