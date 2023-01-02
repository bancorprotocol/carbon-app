import { useCallback, useMemo, useState } from 'react';
import { lsService } from 'services/localeStorage';

export const useWeb3Imposter = () => {
  const [imposterAccount, setImposterAccount] = useState<string>(
    lsService.getItem('imposterAccount') || ''
  );

  const isImposter = useMemo(() => !!imposterAccount, [imposterAccount]);

  const handleImposterAccount = useCallback((account = '') => {
    setImposterAccount(account);
    if (account) {
      lsService.setItem('imposterAccount', account);
    } else {
      lsService.removeItem('imposterAccount');
    }
  }, []);

  return { imposterAccount, handleImposterAccount, isImposter };
};
