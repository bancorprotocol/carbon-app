import { ChangeEvent, FC, FocusEvent, useId } from 'react';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { cn, formatNumber, sanitizeNumber } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';

type InputLimitProps = {
  id?: string;
  price: string;
  setPrice: (value: string) => void;
  base: Token;
  quote: Token;
  error?: string;
  warnings?: string[];
  isOrdersReversed: boolean;
};

export const InputLimit: FC<InputLimitProps> = ({
  id,
  price,
  setPrice,
  base,
  quote,
  error,
  warnings,
}) => {
  const inputId = useId();
  const { marketPrice } = useMarketPrice({ base, quote });

  const showWarning = !error && warnings?.length;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(sanitizeNumber(e.target.value));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) setPrice(formatted);
  };

  const { getFiatAsString } = useFiatCurrency(quote);
  const fiatAsString = getFiatAsString(price);

  return (
    <>
      <div
        className={cn(
          'rounded-16 flex cursor-text flex-col gap-5 border border-black bg-black p-16 focus-within:border-white/50',
          showWarning && 'border-warning focus-within:border-warning',
          error && 'border-error/50 focus-within:border-error/50',
        )}
        onClick={() => document.getElementById(id ?? inputId)?.focus()}
      >
        <div className="flex">
          <input
            id={id ?? inputId}
            type="text"
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={price}
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            onBlur={handleBlur}
            aria-label="Enter Price"
            placeholder="Enter Price"
            className={cn(
              'text-16 font-weight-500 flex-1 text-ellipsis bg-transparent text-start focus:outline-none',
              error && 'text-error',
            )}
            data-testid="input-price"
            required
          />
          {!!marketPrice && (
            <button
              className="text-12 font-weight-500 text-primaryGradient-first hover:text-primary focus:text-primary active:text-primaryGradient-first"
              type="button"
              onClick={() => setPrice(formatNumber(marketPrice.toString()))}
            >
              Use Market
            </button>
          )}
        </div>
        {!!marketPrice && (
          <p className="text-12 break-all text-white/60">{fiatAsString}</p>
        )}
      </div>
      {error ? (
        <Warning isError message={error} htmlFor={id ?? inputId} />
      ) : (
        warnings?.map((warning, i) => (
          <Warning key={i} message={warning} htmlFor={id ?? inputId} />
        ))
      )}
    </>
  );
};
