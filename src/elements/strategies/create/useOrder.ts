import { useState } from 'react';
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
  rangeError: string;
  setRangeError: (value: string) => void;
  priceError: string;
  setPriceError: (value: string) => void;
  budgetError: string;
  setBudgetError: (value: string) => void;
  balanceQuery: any;
  resetFields: (skipBudget?: boolean, skipPrice?: boolean) => void;
}

export const useOrder = () => {
  const [token, setToken] = useState<Token | undefined>();
  const [budget, setBudget] = useState('');
  const [price, setPrice] = useState('');
  const [max, setMax] = useState('');
  const [min, setMin] = useState('');
  const [rangeError, setRangeError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [budgetError, setBudgetError] = useState('');

  const balanceQuery = useGetTokenBalance(token);

  const resetFields = (skipBudget?: boolean, skipPrice?: boolean) => {
    if (!skipPrice) {
      setMin('');
      setMax('');
      setPrice('');
      setPriceError('');
      setRangeError('');
    }

    if (!skipBudget) {
      setBudget('');
      setBudgetError('');
    }
  };

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
    rangeError,
    setRangeError,
    priceError,
    setPriceError,
    budgetError,
    setBudgetError,
    resetFields,
  };
};
