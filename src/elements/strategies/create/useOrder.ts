import { useState } from 'react';
import { Token } from 'tokens';
import { useGetTokenBalance } from 'queries/chain/balance';

export const useOrder = () => {
  const [token, setToken] = useState<Token | undefined>();
  const [budget, setBudget] = useState('');
  const [price, setPrice] = useState('');
  const [max, setMax] = useState('');
  const [min, setMin] = useState('');

  const balanceQuery = useGetTokenBalance(token);

  return {
    token,
    setToken,
    budget,
    setBudget,
    price,
    setPrice,
    max,
    setMax,
    min,
    setMin,
    balanceQuery,
  };
};
