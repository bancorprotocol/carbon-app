import { FocusEvent, FC, useId, useEffect, useState, MouseEvent } from 'react';
import { Token } from 'libs/tokens';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { carbonEvents } from 'services/events';
import {
  cn,
  formatNumber,
  roundSearchParam,
  sanitizeNumber,
} from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useOverlappingMarketPrice } from 'components/strategies/UserMarketPrice';
import { isTouchedZero } from 'components/strategies/common/utils';
import { MarketPriceIndication } from '../marketPriceIndication/MarketPriceIndication';

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
  required?: boolean;
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
  required,
}) => {
  const [localMin, setLocalMin] = useState(roundSearchParam(min));
  const [localMax, setLocalMax] = useState(roundSearchParam(max));
  const marketPrice = useOverlappingMarketPrice({ base, quote });
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

  useEffect(() => {
    if (!min || !max) return;
    if (displayError) {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: displayError,
      });
    }
  }, [min, max, displayError, buy]);

  useEffect(() => {
    if (document.activeElement !== document.getElementById(inputMinId)) {
      setLocalMin(roundSearchParam(min));
    }
  }, [inputMinId, min]);

  useEffect(() => {
    if (document.activeElement !== document.getElementById(inputMaxId)) {
      setLocalMax(roundSearchParam(max));
    }
  }, [inputMaxId, max]);

  const onMinFocus = (e: FocusEvent<HTMLInputElement>) => {
    setLocalMin(min);
    e.target.select();
  };

  const onMinChange = (value: string) => {
    const sanitized = sanitizeNumber(value);
    setLocalMin(sanitized);
    setMin(sanitized);
  };

  const onMinBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setLocalMin(roundSearchParam(formatted));
    setMin(formatted);
  };

  const setMinMarket = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onMinChange(marketPrice?.toString() ?? '');
  };

  const onMaxFocus = (e: FocusEvent<HTMLInputElement>) => {
    setLocalMax(max);
    e.target.select();
  };

  const onMaxChange = (value: string) => {
    const sanitized = sanitizeNumber(value);
    setLocalMax(sanitized);
    setMax(sanitized);
  };

  const onMaxBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setLocalMax(roundSearchParam(formatted));
    setMax(formatted);
  };

  const setMaxMarket = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onMaxChange(marketPrice?.toString() ?? '');
  };

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
                onClick={setMinMarket}
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
            value={localMin}
            placeholder="Enter Price"
            className={cn(
              'text-18 font-weight-500 mb-5 w-full text-ellipsis bg-transparent focus:outline-none',
              hasMinError && 'text-error'
            )}
            onChange={(e) => onMinChange(e.target.value)}
            onFocus={onMinFocus}
            onBlur={onMinBlur}
            data-testid="input-min"
            required={required}
          />
          <MarketPriceIndication
            base={base}
            quote={quote}
            price={min}
            buy={buy || isOverlapping === true}
            isRange
          />
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
                onClick={setMaxMarket}
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
            value={localMax}
            placeholder="Enter Price"
            className={cn(
              'text-18 font-weight-500 mb-5 w-full text-ellipsis bg-transparent focus:outline-none',
              hasMaxError && 'text-error'
            )}
            onChange={(e) => onMaxChange(e.target.value)}
            onFocus={onMaxFocus}
            onBlur={onMaxBlur}
            data-testid="input-max"
            required={required}
          />
          <MarketPriceIndication
            base={base}
            quote={quote}
            price={max}
            buy={buy || isOverlapping === false}
            isRange
          />
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
        displayWarnings.map((warning, i) => (
          <Warning
            key={i}
            message={warning}
            htmlFor={`${inputMinId} ${inputMaxId}`}
          />
        ))}
    </>
  );
};
