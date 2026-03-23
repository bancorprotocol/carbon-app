import {
  FC,
  FocusEvent,
  MouseEvent,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { Token } from 'libs/tokens';
import {
  cn,
  formatNumber,
  roundSearchParam,
  sanitizeNumber,
} from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { isTouchedZero } from './utils';
import { MarketPriceIndication } from '../marketPriceIndication/MarketPriceIndication';
import { Presets } from 'components/common/preset/Preset';
import { SafeDecimal } from 'libs/safedecimal';
import { limitPreset } from './price-presets';
import { useStrategyFormCtx } from './StrategyFormContext';

type InputLimitProps = {
  id?: string;
  price: string;
  setPrice: (value: string) => void;
  setPreset: (value: string) => void;
  base: Token;
  quote: Token;
  error?: string;
  warnings?: (string | undefined)[];
  isBuy?: boolean;
  ignoreMarketPriceWarning?: boolean;
  required?: boolean;
};

export const InputLimit: FC<InputLimitProps> = (props) => {
  const {
    price,
    setPrice,
    setPreset,
    base,
    quote,
    error,
    warnings = [],
    isBuy = false,
    ignoreMarketPriceWarning = false,
    required,
  } = props;
  const [localPrice, setLocalPrice] = useState(roundSearchParam(price));
  const inputId = useId();
  const id = props.id ?? inputId;
  const { marketPrice } = useStrategyFormCtx();

  const percent = useMemo(() => {
    if (!marketPrice) return '';
    return new SafeDecimal(price).div(marketPrice).sub(1).abs().toString();
  }, [marketPrice, price]);

  // Errors
  const priceError = isTouchedZero(price) && 'Price must be greater than 0';
  const displayError = priceError || error;

  // Warnings
  const displayWarnings = warnings.filter((v) => !!v);
  const showWarning = !displayError && !!displayWarnings?.length;

  useEffect(() => {
    if (document.activeElement?.id !== id) {
      setLocalPrice(roundSearchParam(price));
    }
  }, [id, price]);

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setLocalPrice(price);
    e.target.select();
  };

  const onChange = (value: string) => {
    const sanitized = sanitizeNumber(value);
    setLocalPrice(sanitized);
    setPrice(sanitized);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setLocalPrice(roundSearchParam(formatted));
    setPrice(formatted);
  };

  const setMarket = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onChange(formatNumber(marketPrice?.toString() ?? ''));
  };

  return (
    <>
      <div
        className="rounded-2xl flex cursor-text flex-col gap-8 input-container"
        onClick={() => document.getElementById(id)?.focus()}
      >
        <div className="flex">
          <input
            id={id}
            type="text"
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={localPrice}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-label="Enter Price"
            placeholder="Enter Price"
            className={cn(
              'text-24 font-medium w-0 flex-1 text-ellipsis bg-transparent text-start focus:outline-hidden',
              displayError && 'text-error',
            )}
            data-testid="input-price"
            required={required}
          />
          {!!marketPrice && (
            <button
              className="text-12 font-medium text-gradient hover:text-secondary focus:text-secondary active:text-secondary"
              type="button"
              onClick={setMarket}
            >
              Use Market
            </button>
          )}
        </div>
        <MarketPriceIndication
          base={base}
          quote={quote}
          price={price}
          isBuy={isBuy}
          ignoreMarketPriceWarning={ignoreMarketPriceWarning}
        />
      </div>
      {!!displayError && (
        <Warning isError message={displayError} htmlFor={id} />
      )}
      {showWarning &&
        displayWarnings.map((warning, i) => (
          <Warning key={i} message={warning} htmlFor={id} />
        ))}
      {!!marketPrice && (
        <Presets
          value={percent}
          presets={limitPreset(isBuy)}
          onChange={setPreset}
        />
      )}
    </>
  );
};
