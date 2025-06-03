import { ChangeEvent, FocusEvent, FC, useId, useEffect } from 'react';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { cn, formatNumber, sanitizeNumber } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useOverlappingMarketPrice } from 'components/strategies/UserMarketPrice';

type InputRangeProps = {
  min: string;
  minLabel?: string;
  setMin: (value: string) => void;
  max: string;
  maxLabel?: string;
  setMax: (value: string) => void;
  quote: Token;
  base: Token;
  buy?: boolean;
  error?: string;
  warnings?: string[];
  setRangeError: (error: string) => void;
  ignoreMarketPriceWarning?: boolean;
  isOrdersReversed?: boolean;
  /** Used to change the warning logic in market price percent */
  isOverlapping?: boolean;
};

export const InputRange: FC<InputRangeProps> = ({
  min,
  minLabel = 'Min',
  setMin,
  max,
  maxLabel = 'Max',
  setMax,
  quote,
  base,
  error,
  setRangeError,
  buy = false,
  warnings,
  isOrdersReversed,
}) => {
  const marketPrice = useOverlappingMarketPrice({ base, quote });
  const inputMinId = useId();
  const inputMaxId = useId();
  const errorMinMax = 'Maximum price must be higher than the minimum price';
  const errorAboveZero = 'Price must be greater than 0';
  const errorReversedOrders =
    'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  const showWarning = !error && warnings?.length;

  // Handle errors
  useEffect(() => {
    if (!min || !max) return;
    const minValue = Number(formatNumber(min));
    const maxValue = Number(formatNumber(max));
    let errorMessage = '';
    if (isOrdersReversed) errorMessage = errorReversedOrders;
    if (minValue >= maxValue) errorMessage = errorMinMax;
    if (minValue <= 0 || maxValue <= 0) errorMessage = errorAboveZero;
    setRangeError(errorMessage);
  }, [min, max, setRangeError, isOrdersReversed, buy]);

  const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
    setMin(sanitizeNumber(e.target.value));
  };
  const handleBlurMin = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) setMin(formatted);
  };

  const handleChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
    setMax(sanitizeNumber(e.target.value));
  };
  const handleBlurMax = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) setMax(formatted);
  };

  const { getFiatAsString } = useFiatCurrency(quote);

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div
          className={cn(
            'rounded-r-4 rounded-l-16 w-full cursor-text border border-black bg-black p-16 focus-within:border-white/50',
            showWarning && 'border-warning focus-within:border-warning',
            error && 'border-error/50 focus-within:border-error',
          )}
          onClick={() => document.getElementById(inputMinId)?.focus()}
        >
          <header className="text-12 mb-5 flex justify-between text-white/60">
            <Tooltip
              element={`The lowest price to ${buy ? 'buy' : 'sell'} ${
                base.symbol
              } at.`}
            >
              <label htmlFor={inputMinId}>{minLabel}</label>
            </Tooltip>
            {!!marketPrice && (
              <button
                className="text-12 font-weight-500 text-primaryGradient-first hover:text-primary focus:text-primary active:text-primaryGradient-first"
                type="button"
                onClick={() => setMin(formatNumber(marketPrice.toString()))}
                data-testid="market-price-min"
              >
                Use Market
              </button>
            )}
          </header>
          <input
            id={inputMinId}
            type="text"
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={min}
            placeholder="Enter Price"
            className={cn(
              'text-18 font-weight-500 mb-5 w-full text-ellipsis bg-transparent focus:outline-none',
              error && 'text-error',
            )}
            onChange={handleChangeMin}
            onFocus={(e) => e.target.select()}
            onBlur={handleBlurMin}
            data-testid="input-min"
            required
          />
          {!!marketPrice && (
            <p className="text-12 break-all text-white/60">
              {getFiatAsString(min)}
            </p>
          )}
        </div>
        <div
          className={cn(
            'rounded-r-16 rounded-l-4 w-full cursor-text border border-black bg-black p-16 focus-within:border-white/50',
            showWarning && 'border-warning focus-within:border-warning',
            error && 'border-error/50 focus-within:border-error',
          )}
          onClick={() => document.getElementById(inputMaxId)?.focus()}
        >
          <header className="text-12 mb-5 flex justify-between text-white/60">
            <Tooltip
              element={`The highest price to ${buy ? 'buy' : 'sell'} ${
                base.symbol
              } at.`}
            >
              <label htmlFor={inputMaxId}>{maxLabel}</label>
            </Tooltip>
            {!!marketPrice && (
              <button
                className="text-12 font-weight-500 text-primaryGradient-first hover:text-primary focus:text-primary active:text-primaryGradient-first"
                type="button"
                onClick={() => setMax(formatNumber(marketPrice.toString()))}
                data-testid="market-price-max"
              >
                Use Market
              </button>
            )}
          </header>
          <input
            id={inputMaxId}
            type="text"
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={max}
            placeholder="Enter Price"
            className={cn(
              'text-16 font-weight-500 mb-5 w-full text-ellipsis bg-transparent focus:outline-none',
              error && 'text-error',
            )}
            onChange={handleChangeMax}
            onFocus={(e) => e.target.select()}
            onBlur={handleBlurMax}
            data-testid="input-max"
            required
          />
          {!!marketPrice && (
            <p className="text-12 break-all text-white/60">
              {getFiatAsString(max)}
            </p>
          )}
        </div>
      </div>
      {error ? (
        <Warning
          isError
          message={error}
          htmlFor={`${inputMinId} ${inputMaxId}`}
        />
      ) : (
        warnings?.map((warning, i) => (
          <Warning
            key={i}
            message={warning}
            htmlFor={`${inputMinId} ${inputMaxId}`}
          />
        ))
      )}
    </>
  );
};
