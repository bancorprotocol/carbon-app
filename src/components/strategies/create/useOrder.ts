import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { Order } from 'libs/queries';
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
  setIsRange: (value: boolean) => void;
  isRange: boolean;
  setPriceError: (value: string) => void;
  budgetError: string;
  setBudgetError: (value: string) => void;
  marginalPrice: string;
  setMarginalPrice: (value: string) => void;
  marginalPriceOption?: MarginalPriceOptions;
  setMarginalPriceOption: (value: MarginalPriceOptions) => void;
  resetFields: (skipBudget?: boolean, skipPrice?: boolean) => void;
}

export const useOrder = (order?: Order) => {
  const [budget, setBudget] = useState(order?.balance ?? '');
  const [price, setPrice] = useState(
    order?.startRate !== order?.endRate ? '' : order?.startRate ?? ''
  );
  const [max, setMax] = useState(
    order?.startRate !== order?.endRate ? order?.endRate ?? '' : ''
  );
  const [min, setMin] = useState(
    order?.startRate !== order?.endRate ? order?.startRate ?? '' : ''
  );
  const [rangeError, setRangeError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [marginalPrice, setMarginalPrice] = useState(order?.marginalRate ?? '');
  const [budgetError, setBudgetError] = useState('');
  const [isRange, setIsRange] = useState(order?.startRate !== order?.endRate);
  const [marginalPriceOption, setMarginalPriceOption] =
    useState<MarginalPriceOptions>();

  const resetFields = (skipBudget?: boolean, skipPrice?: boolean) => {
    if (!skipPrice) {
      setMin('');
      setMax('');
      setPrice('');
      setMarginalPrice('');
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
    isRange,
    setIsRange,
    setRangeError,
    priceError,
    setPriceError,
    budgetError,
    setBudgetError,
    marginalPrice,
    setMarginalPrice,
    marginalPriceOption,
    setMarginalPriceOption,
    resetFields,
  };
};
