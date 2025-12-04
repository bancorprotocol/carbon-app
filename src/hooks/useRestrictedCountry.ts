import { useCallback } from 'react';
import { carbonApi } from 'utils/carbonApi';
import { useModal } from './useModal';

export const useRestrictedCountry = () => {
  const { openModal } = useModal();
  /** Return true if check pass, else open modal & return false */
  const checkRestriction = useCallback(async () => {
    const isBlocked = await carbonApi.getCheck();
    if (!isBlocked) return true;
    openModal('restrictedCountry');
    return false;
  }, [openModal]);
  return { checkRestriction };
};
