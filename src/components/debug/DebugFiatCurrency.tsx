import { useFiatCurrency } from 'hooks/useFiatCurrency';

export const DebugFiatCurrency = () => {
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();

  return (
    <div className="grid place-items-center gap-20 rounded-3xl surface p-20">
      <h2>Fiat Currency Selection</h2>

      {availableCurrencies.map((currency) => (
        <button
          key={currency}
          className={
            currency === selectedFiatCurrency
              ? 'btn-primary-gradient'
              : 'btn-on-surface'
          }
          onClick={() => setSelectedFiatCurrency(currency)}
        >
          {currency}
        </button>
      ))}
    </div>
  );
};
