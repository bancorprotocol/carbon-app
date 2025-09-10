import { useWagmi } from 'libs/wagmi';
import { useCallback, useEffect, useState } from 'react';

export const DebugBalance = () => {
  const { getBalance, user } = useWagmi();
  const [balance, setBalance] = useState('');

  const fetchGasToken = useCallback(async () => {
    if (!user) return;

    try {
      const res = await getBalance(user);
      setBalance(res.toString());
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchGasToken();
    } else {
      setBalance('');
    }
  }, [fetchGasToken, user]);

  return <div>{balance}</div>;
};
