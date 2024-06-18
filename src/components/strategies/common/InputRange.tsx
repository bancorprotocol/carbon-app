import { ChangeEvent, FocusEvent, FC, useId, useEffect } from 'react';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication';
import { carbonEvents } from 'services/events';
import { cn, formatNumber, sanitizeNumber } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { marketPricePercent } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useUserMarketPrice } from 'components/strategies/UserMarketPrice';
import { isTouchedZero } from 'components/strategies/common/utils';

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
  warnings?: (string | undefined)[];
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
  buy = false,
  warnings = [],
  isOverlapping,
}) => {
  const marketPrice = useUserMarketPrice({ base, quote });
  const inputMinId = useId();
  const inputMaxId = useId();

  // Errors
  const minError = isTouchedZero(min) && 'Min must be greater than 0';
  const maxError = isTouchedZero(max) && 'Max must be greater than 0';
  const rangeError =
    min &&
    max &&
    +min >= +max &&
    'Maximum price must be higher than the minimum price';

  const hasMinError = !!(minError || error || rangeError);
  const hasMaxError = !!(maxError || error || rangeError);
  const displayError = minError || maxError || error || rangeError;

  // Warnings
  const noMarketPrice = !marketPrice
    ? 'Difference from current market price cannot be calculated.'
    : '';
  const displayWarnings = [...warnings, noMarketPrice].filter((v) => !!v);
  const showWarning = !displayError && !!displayWarnings.length;
  const marketPricePercentages = {
    min: marketPricePercent(min, marketPrice),
    max: marketPricePercent(max, marketPrice),
  };

  useEffect(() => {
    if (!min || !max) return;
    if (displayError) {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: displayError,
      });
    }
  }, [min, max, displayError, buy]);

  const changeMin = (e: ChangeEvent<HTMLInputElement>) => {
    setMin(sanitizeNumber(e.target.value));
  };
  const formatMin = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) setMin(formatted);
  };

  const changeMax = (e: ChangeEvent<HTMLInputElement>) => {
    setMax(sanitizeNumber(e.target.value));
  };
  const formatMax = (e: FocusEvent<HTMLInputElement>) => {
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
            hasMinError && 'border-error/50 focus-within:border-error'
          )}
          onClick={() => document.getElementById(inputMinId)?.focus()}
        >
          <header className="text-12 mb-5 flex justify-between text-white/60">
            <Tooltip
              sendEventOnMount={{ buy }}
              element={`The lowest price to ${buy ? 'buy' : 'sell'} ${
                base.symbol
              } at.`}
            >
              <label htmlFor={inputMinId}>{minLabel}</label>
            </Tooltip>
            {!!marketPrice && (
              <button
                className="text-12 font-weight-500 text-primary hover:text-primary-light focus:text-primary-light active:text-primary"
                type="button"
                onClick={() => setMin(formatNumber(marketPrice.toString()))}
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
              hasMinError && 'text-error'
            )}
            onChange={changeMin}
            onFocus={(e) => e.target.select()}
            onBlur={formatMin}
            data-testid="input-min"
            required
          />
          {!!marketPrice && (
            <p className="flex flex-wrap items-center gap-4">
              <span className="text-12 break-all text-white/60">
                {getFiatAsString(min)}
              </span>
              {marketPricePercentages && (
                <MarketPriceIndication
                  marketPricePercentage={marketPricePercentages.min}
                  isRange
                  buy={buy || isOverlapping === true}
                />
              )}
            </p>
          )}
        </div>
        <div
          className={cn(
            'rounded-r-16 rounded-l-4 w-full cursor-text border border-black bg-black p-16 focus-within:border-white/50',
            showWarning && 'border-warning focus-within:border-warning',
            hasMaxError && 'border-error/50 focus-within:border-error'
          )}
          onClick={() => document.getElementById(inputMaxId)?.focus()}
        >
          <header className="text-12 mb-5 flex justify-between text-white/60">
            <Tooltip
              sendEventOnMount={{ buy }}
              element={`The highest price to ${buy ? 'buy' : 'sell'} ${
                base.symbol
              } at.`}
            >
              <label htmlFor={inputMaxId}>{maxLabel}</label>
            </Tooltip>
            {!!marketPrice && (
              <button
                className="text-12 font-weight-500 text-primary hover:text-primary-light focus:text-primary-light active:text-primary"
                type="button"
                onClick={() => setMax(formatNumber(marketPrice.toString()))}
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
              'text-18 font-weight-500 mb-5 w-full text-ellipsis bg-transparent focus:outline-none',
              hasMaxError && 'text-error'
            )}
            onChange={changeMax}
            onFocus={(e) => e.target.select()}
            onBlur={formatMax}
            data-testid="input-max"
            required
          />
          {!!marketPrice && (
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-12 break-all text-white/60">
                {getFiatAsString(max)}
              </p>
              {marketPricePercentages && (
                <MarketPriceIndication
                  marketPricePercentage={marketPricePercentages.max}
                  isRange
                  buy={buy}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {!!displayError && (
        <Warning
          isError
          message={displayError}
          htmlFor={`${inputMinId} ${inputMaxId}`}
        />
      )}
      {showWarning &&
        displayWarnings.map((warning) => (
          <Warning message={warning} htmlFor={`${inputMinId} ${inputMaxId}`} />
        ))}
    </>
  );
};
