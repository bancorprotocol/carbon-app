import { Dispatch, SetStateAction, useState } from 'react';

export const AVAILABLE_CURRENCIES = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNH',
] as const;

export type FiatSymbol = (typeof AVAILABLE_CURRENCIES)[number];

export type FiatPriceDict = {
  [k in FiatSymbol]: number;
};

export interface FiatCurrencyStore {
  availableCurrencies: readonly FiatSymbol[];
  selectedFiatCurrency: FiatSymbol;
  setSelectedFiatCurrency: Dispatch<SetStateAction<FiatSymbol>>;
}

export const useFiatCurrencyStore = (): FiatCurrencyStore => {
  const [selectedFiatCurrency, setSelectedFiatCurrency] =
    useState<FiatSymbol>('USD');

  return {
    selectedFiatCurrency,
    setSelectedFiatCurrency,
    availableCurrencies: AVAILABLE_CURRENCIES,
  };
};

export const defaultFiatCurrencyStore: FiatCurrencyStore = {
  selectedFiatCurrency: 'USD',
  setSelectedFiatCurrency: () => {},
  availableCurrencies: AVAILABLE_CURRENCIES,
};
