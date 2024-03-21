import { ChangeEvent, FC, FocusEvent, useEffect, useId } from 'react';
import { carbonEvents } from 'services/events';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { formatNumber, sanitizeNumber } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

type InputLimitProps = {
  id?: string;
  price: string;
  setPrice: (value: string) => void;
  token: Token;
  error?: string;
  warnings?: string[];
  setPriceError?: (error: string) => void;
  buy?: boolean;
  marketPricePercentage: MarketPricePercentage;
  ignoreMarketPriceWarning?: boolean;
  isOrdersReversed: boolean;
};

export const InputLimit: FC<InputLimitProps> = ({
  id,
  price,
  setPrice,
  token,
  error,
  warnings,
  setPriceError,
  marketPricePercentage,
  buy = false,
  ignoreMarketPriceWarning,
  isOrdersReversed,
}) => {
  const inputId = useId();

  const errorAboveZero = 'Price must be greater than 0';
  const errorReversedOrders =
    'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  const showWarning = !error && warnings?.length;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(sanitizeNumber(e.target.value));
  };

  useEffect(() => {
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

  const { getFiatAsString } = useFiatCurrency(token);
  const fiatAsString = getFiatAsString(price);

  return (
    <>
      <div
        className={`
          flex cursor-text flex-col rounded-16 border border-black bg-black p-16
          focus-within:border-white/50
          ${error ? '!border-error/50' : ''}
          ${showWarning ? '!border-warning' : ''}
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
          onBlur={handleBlur}
          aria-label="Enter Price"
          placeholder="Enter Price"
          className={`
            mb-5 w-full text-ellipsis bg-transparent text-start text-18 font-weight-500 focus:outline-none
            ${error ? 'text-error' : ''}
          `}
          data-testid="input-price"
        />
        <p className="flex flex-wrap items-center gap-8">
          <span className="break-all font-mono text-12 text-white/60">
            {fiatAsString}
          </span>
          <MarketPriceIndication
            marketPricePercentage={marketPricePercentage.price}
            buy={buy}
            ignoreMarketPriceWarning={ignoreMarketPriceWarning}
          />
        </p>
      </div>
      {error ? (
        <WarningMessageWithIcon
          className="text-error"
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
