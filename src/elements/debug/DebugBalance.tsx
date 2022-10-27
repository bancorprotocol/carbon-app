import { useWeb3 } from 'providers/Web3Provider';
import { useCallback, useEffect, useState } from 'react';

export const DebugBalance = () => {
  const { provider, user } = useWeb3();
  const [balance, setBalance] = useState('');

  const fetchETH = useCallback(async () => {
    if (!provider) {
      return console.log('Not provider set.');
    }
    if (!user) {
      return console.log('Not logged in.');
    }

    console.log('going for it');

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
