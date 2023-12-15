import { ChangeEvent, FC, useId } from 'react';
import { carbonEvents } from 'services/events';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { sanitizeNumberInput } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication/useMarketIndication';

type InputLimitProps = {
  id?: string;
  price: string;
  setPrice: (value: string) => void;
  token: Token;
  error?: string;
  setPriceError: (error: string) => void;
  buy?: boolean;
  marketPricePercentage: MarketPricePercentage;
};

export const InputLimit: FC<InputLimitProps> = ({
  id,
  price,
  setPrice,
  token,
  error,
  setPriceError,
  marketPricePercentage,
  buy = false,
}) => {
  const inputId = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeNumberInput(e.target.value);
    if (Number(value) > 0) {
      setPriceError('');
    } else {
      const errorMessage = 'Price must be greater than 0';
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: errorMessage,
      });
      setPriceError(errorMessage);
    }
    setPrice(value);
  };

  const { getFiatAsString } = useFiatCurrency(token);
  const fiatAsString = getFiatAsString(price);

  return (
    <>
      <div
        className={`
          bg-body flex cursor-text flex-col rounded-16 border p-16
          focus-within:border-white/50
          ${error ? '!border-red/50' : 'border-black'} 
        `}
        onClick={() => document.getElementById(id ?? inputId)?.focus()}
      >
        <input
          id={id ?? inputId}
          type="text"
          pattern={decimalNumberValidationRegex}
          inputMode="decimal"
          value={price}
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          aria-label="Enter Price"
          placeholder="Enter Price"
          className={`
            mb-5 w-full text-ellipsis bg-transparent text-start text-18 font-weight-500 focus:outline-none
            ${error ? 'text-red' : ''}
          `}
          data-testid="input-limit"
        />
        <p className="flex flex-wrap items-center gap-8">
          <span className="break-all font-mono text-12 text-white/60">
            {fiatAsString}
          </span>
          <MarketPriceIndication
            marketPricePercentage={marketPricePercentage.price}
          />
        </p>
      </div>
      {error && (
        <output
          htmlFor={id ?? inputId}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-10 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span className="flex-1">{error}</span>
        </output>
      )}
    </>
  );
};
