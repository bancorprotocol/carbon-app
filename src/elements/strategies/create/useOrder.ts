import { useEffect, useState } from 'react';
import { Token } from 'tokens';
import { useGetTokenBalance } from 'queries/chain/balance';

export interface Order {
  token?: Token;
  price: string;
  setPrice: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  priceError: string;
  setPriceError: (value: string) => void;
  balanceQuery: any;
}

export const useOrder = () => {
  const [token, setToken] = useState<Token | undefined>();
  const [budget, setBudget] = useState('');
  const [price, setPrice] = useState('');
  const [max, setMax] = useState('');
  const [min, setMin] = useState('');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    setMin('');
    setMax('');
    setPrice('');
    setBudget('');
  }, [token?.address]);

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
    priceError,
    setPriceError,
  };
};
