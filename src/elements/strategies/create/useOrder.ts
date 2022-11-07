import { useState } from 'react';

export const useOrder = () => {
  const [token, setToken] = useState('');
  const [liquidity, setLiquidity] = useState('');
  const [intercept, setIntercept] = useState('');
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');

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
  };
};
