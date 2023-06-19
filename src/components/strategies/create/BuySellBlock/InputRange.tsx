import { ChangeEvent, FC, FocusEvent } from 'react';
import BigNumber from 'bignumber.js';
import { carbonEvents } from 'services/events';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication';
import { sanitizeNumberInput } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const InputRange: FC<{
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  token: Token;
  buy?: boolean;
  error?: string;
  setRangeError: (error: string) => void;
  marketPricePercentages: {
    min: BigNumber;
    max: BigNumber;
  };
}> = ({
  min,
  setMin,
  max,
  setMax,
  token,
  error,
  setRangeError,
  buy = false,
  marketPricePercentages,
}) => {
  const errorMessage = 'Max Price must be higher than min price and not zero';

  const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
    setMin(sanitizeNumberInput(e.target.value));
    if (!max || (+e.target.value > 0 && +max > +e.target.value)) {
      setRangeError('');
    } else {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: errorMessage,
      });
      setRangeError(errorMessage);
    }
  };

  const handleChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
    setMax(sanitizeNumberInput(e.target.value));
    if (!min || (+e.target.value > 0 && +e.target.value > +min)) {
      setRangeError('');
    } else {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: errorMessage,
      });
      setRangeError(errorMessage);
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const { getFiatAsString } = useFiatCurrency(token);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-4 rounded-l-16 border-2 border-black p-16`}
        >
          <Tooltip
            sendEventOnMount={{ buy }}
            element={`The lowest price to ${buy ? 'buy' : 'sell'} ${
              token.symbol
            } at.`}
          >
            <div className={'mb-5 text-12 text-white/60'}>Min</div>
          </Tooltip>
          <input
            type={'text'}
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={min}
            onChange={handleChangeMin}
            placeholder="Enter Price"
            onFocus={handleFocus}
            className={
              'mb-5 w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="flex flex-col items-start gap-4">
            <div className="break-all font-mono text-12 text-white/60">
              {getFiatAsString(min)}
            </div>
            <MarketPriceIndication
              marketPricePercentage={marketPricePercentages.min}
              isRange
            />
          </div>
        </div>
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-16 rounded-l-4 border-2 border-black p-16`}
        >
          <Tooltip
            sendEventOnMount={{ buy }}
            element={`The highest price to ${buy ? 'buy' : 'sell'} ${
              token.symbol
            } at.`}
          >
            <div className={'mb-5 text-12 text-white/60'}>Max</div>
          </Tooltip>
          <input
            type={'text'}
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={max}
            onChange={handleChangeMax}
            placeholder={`Enter Price`}
            onFocus={handleFocus}
            className={
              'mb-5 w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="flex flex-col items-start gap-4">
            <div className="break-all font-mono text-12 text-white/60">
              {getFiatAsString(max)}
            </div>
            <MarketPriceIndication
              marketPricePercentage={marketPricePercentages.max}
              isRange
            />
          </div>
        </div>
      </div>
      <div
        className={`mt-10 flex h-16 items-center gap-10 text-left font-mono text-12 text-red ${
          !error ? 'invisible' : ''
        }`}
      >
        <IconWarning className="h-12 w-12" />
        <div>{error ? error : ''}</div>
      </div>
    </div>
  );
};
