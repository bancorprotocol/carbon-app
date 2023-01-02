import { useWeb3 } from 'libs/web3';
import { useCallback, useEffect, useState } from 'react';

export const DebugBalance = () => {
  const { provider, user } = useWeb3();
  const [balance, setBalance] = useState('');

  const fetchETH = useCallback(async () => {
    if (!provider || !user) return;

    try {
      const res = await provider.getBalance(user);
      setBalance(res.toString());
    } catch (e) {
      console.error(e);
    }
  }, [provider, user]);

  useEffect(() => {
    if (provider && user) {
      fetchETH();
    } else {
      setBalance('');
    }
  }, [fetchETH, provider, user]);

  return <div>{balance}</div>;
};
