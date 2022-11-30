import { useState } from 'react';
import { Token } from 'services/tokens';
import { useGetTokenBalance } from 'queries/chain/balance';

export const useOrder = () => {
  const [token, setToken] = useState<Token | undefined>();
  const [liquidity, setLiquidity] = useState('');
  const [intercept, setIntercept] = useState('');
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');

  const balanceQuery = useGetTokenBalance(token);

  return {
    token,
    setToken,
    liquidity,
    setLiquidity,
    intercept,
    setIntercept,
    high,
    setHigh,
    low,
    setLow,
    balanceQuery,
  };
};
