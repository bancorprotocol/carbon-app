import { useCallback, useMemo, useState } from 'react';
import { lsService } from 'services/localeStorage';

export const useWagmiImposter = () => {
  const [imposterAccount, setImposterAccount] = useState<string>(
    lsService.getItem('imposterAccount') || ''
  );

  const isImposter = useMemo(() => !!imposterAccount, [imposterAccount]);

  const handleImposterAccount = useCallback(
    /**
     * Set imposter account to mock in storage
     * @param {string} account account to mock
     */
    (account = '') => {
      setImposterAccount(account);
      if (account) {
        lsService.setItem('imposterAccount', account);
      } else {
        lsService.removeItem('imposterAccount');
      }
    },
    []
  );

  return { imposterAccount, handleImposterAccount, isImposter };
};
