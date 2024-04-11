import { ChangeEvent, FC, FocusEvent, useEffect, useId } from 'react';
import { carbonEvents } from 'services/events';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { formatNumber, sanitizeNumber } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';

type InputLimitProps = {
  id?: string;
  price: string;
  setPrice: (value: string) => void;
  base: Token;
  quote: Token;
  error?: string;
  warnings?: string[];
  setPriceError?: (error: string) => void;
  buy?: boolean;
  marketPricePercentage?: MarketPricePercentage;
  ignoreMarketPriceWarning?: boolean;
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
  setPriceError,
  marketPricePercentage,
  buy = false,
  ignoreMarketPriceWarning,
  isOrdersReversed,
}) => {
  const inputId = useId();
  const marketPrice = useMarketPrice({ base, quote });

  const errorAboveZero = 'Price must be greater than 0';
  const errorReversedOrders =
    'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  const showWarning = !error && warnings?.length;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(sanitizeNumber(e.target.value));
  };

  useEffect(() => {
    if (!price) return;
    let errorMessage = '';
    if (isOrdersReversed) errorMessage = errorReversedOrders;
    if (+price <= 0) errorMessage = errorAboveZero;
    if (setPriceError) setPriceError(errorMessage);
    if (errorMessage) {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: errorMessage,
      });
    }
  }, [price, setPriceError, buy, isOrdersReversed]);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) setPrice(formatted);
  };

  const { getFiatAsString } = useFiatCurrency(quote);
  const fiatAsString = getFiatAsString(price);

  return (
    <>
      <div
        className={`
          flex cursor-text flex-col gap-5 rounded-16 border border-black bg-black p-16
          focus-within:border-white/50
          ${error ? '!border-error/50' : ''}
          ${showWarning ? '!border-warning' : ''}
        `}
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
            className={`
              flex-1 text-ellipsis bg-transparent text-start text-18 font-weight-500 focus:outline-none
              ${error ? 'text-error' : ''}
            `}
            data-testid="input-price"
          />
          {marketPrice !== 0 && (
            <button
              className="text-12 font-weight-500 text-primary hover:text-primary-light focus:text-primary-light active:text-primary"
              type="button"
              onClick={() => setPrice(formatNumber(marketPrice.toString()))}
            >
              Use Market
            </button>
          )}
        </div>
        <p className="flex flex-wrap items-center gap-8">
          <span className="break-all font-mono text-12 text-white/60">
            {fiatAsString}
          </span>
          {marketPricePercentage && (
            <MarketPriceIndication
              marketPricePercentage={marketPricePercentage.price}
              buy={buy}
              ignoreMarketPriceWarning={ignoreMarketPriceWarning}
            />
          )}
        </p>
      </div>
      {error ? (
        <WarningMessageWithIcon
          isError
          message={error}
          htmlFor={id ?? inputId}
        />
      ) : (
        warnings?.map((warning, i) => (
          <WarningMessageWithIcon
            key={i}
            message={warning}
            htmlFor={id ?? inputId}
          />
        ))
      )}
    </>
  );
};
