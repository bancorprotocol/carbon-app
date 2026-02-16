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
        className="rounded-2xl flex cursor-text flex-col gap-8 border border-transparent bg-main-900 hover:bg-main-900/40 p-16 focus-within:border-main-0/50"
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
              'text-24 font-medium flex-1 text-ellipsis bg-transparent text-start focus:outline-hidden',
              error && 'text-error',
            )}
            data-testid="input-price"
            required
          />
          {!!marketPrice && (
            <button
              className="text-12 font-medium text-gradient hover:text-secondary focus:text-secondary active:text-secondary"
              type="button"
              onClick={() => setPrice(formatNumber(marketPrice.toString()))}
            >
              Use Market
            </button>
          )}
        </div>
        {!!marketPrice && (
          <p className="text-12 break-all text-main-0/60">{fiatAsString}</p>
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
