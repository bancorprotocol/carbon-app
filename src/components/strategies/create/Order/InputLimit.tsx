import { ChangeEvent, FC, FocusEvent, useEffect, useId } from 'react';
import { carbonEvents } from 'services/events';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { cn, formatNumber, sanitizeNumber } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication';
import { marketPricePercent } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { isTouchedZero } from '../../common/utils';

type InputLimitProps = {
  id?: string;
  price: string;
  setPrice: (value: string) => void;
  base: Token;
  quote: Token;
  error?: string;
  warnings?: (string | undefined)[];
  buy?: boolean;
};

export const InputLimit: FC<InputLimitProps> = ({
  id,
  price,
  setPrice,
  base,
  quote,
  error,
  warnings = [],
  buy = false,
}) => {
  const inputId = useId();
  const marketPrice = useMarketPrice({ base, quote });
  const marketPercent = marketPricePercent(price, marketPrice);
  const { getFiatAsString } = useFiatCurrency(quote);
  const fiatAsString = getFiatAsString(price);

  // Errors
  const priceError = isTouchedZero(price) && 'Price must be greater than 0';
  const displayError = priceError || error;

  // Warnings
  const noMarketPrice = !marketPrice
    ? 'Notice: price & slippage are unknown'
    : '';
  const displayWarnings = [...warnings, noMarketPrice].filter((v) => !!v);
  const showWarning = !displayError && !!displayWarnings?.length;

  const changePrice = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(sanitizeNumber(e.target.value));
  };

  useEffect(() => {
    if (!price) return;
    if (displayError) {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: displayError,
      });
    }
  }, [displayError, buy, price]);

  const formatePrice = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) setPrice(formatted);
  };

  return (
    <>
      <div
        className={cn(
          'rounded-16 flex cursor-text flex-col gap-5 border border-black bg-black p-16 focus-within:border-white/50',
          showWarning && 'border-warning focus-within:border-warning',
          displayError && 'border-error/50 focus-within:border-error/50'
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
            onChange={changePrice}
            onFocus={(e) => e.target.select()}
            onBlur={formatePrice}
            aria-label="Enter Price"
            placeholder="Enter Price"
            className={cn(
              'text-18 font-weight-500 flex-1 text-ellipsis bg-transparent text-start focus:outline-none',
              displayError && 'text-error'
            )}
            data-testid="input-price"
            required
          />
          {!!marketPrice && (
            <button
              className="text-12 font-weight-500 text-primary hover:text-primary-light focus:text-primary-light active:text-primary"
              type="button"
              onClick={() => setPrice(formatNumber(marketPrice.toString()))}
            >
              Use Market
            </button>
          )}
        </div>
        {!!marketPrice && (
          <p className="flex flex-wrap items-center gap-8">
            <span className="text-12 break-all text-white/60">
              {fiatAsString}
            </span>
            {!!marketPercent && (
              <MarketPriceIndication
                marketPricePercentage={marketPercent}
                buy={buy}
              />
            )}
          </p>
        )}
      </div>
      {!!displayError && (
        <WarningMessageWithIcon
          isError
          message={displayError}
          htmlFor={inputId}
        />
      )}
      {showWarning &&
        displayWarnings.map((warning) => (
          <WarningMessageWithIcon message={warning} htmlFor={inputId} />
        ))}
    </>
  );
};
