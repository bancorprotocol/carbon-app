import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { AVAILABLE_CURRENCIES, FiatSymbol } from 'utils/carbonApi';

export interface FiatCurrencyStore {
  availableCurrencies: readonly FiatSymbol[];
  selectedFiatCurrency: FiatSymbol;
  setSelectedFiatCurrency: (currency: FiatSymbol) => void;
}

// TODO: remove the fiat selection logic
export const useFiatCurrencyStore = (): FiatCurrencyStore => {
  const [selectedFiatCurrency, _setSelectedFiatCurrency] =
    useState<FiatSymbol>('USD');

  const setSelectedFiatCurrency = (currency: FiatSymbol) => {
    _setSelectedFiatCurrency(currency);
    lsService.setItem('currentCurrency', currency);
  };

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
