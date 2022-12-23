import { useState } from 'react';

export interface OrderCreate {
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
  resetFields: (skipBudget?: boolean, skipPrice?: boolean) => void;
}

export const useOrder = () => {
  const [budget, setBudget] = useState('');
  const [price, setPrice] = useState('');
  const [max, setMax] = useState('');
  const [min, setMin] = useState('');
  const [rangeError, setRangeError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [budgetError, setBudgetError] = useState('');

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
    budget,
    setBudget,
    price,
    setPrice,
    max,
    setMax,
    min,
    setMin,
    rangeError,
    setRangeError,
    priceError,
    setPriceError,
    budgetError,
    setBudgetError,
    resetFields,
  };
};
