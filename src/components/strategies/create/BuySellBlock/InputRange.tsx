import { ChangeEvent, FC, FocusEvent } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { sanitizeNumberInput } from 'utils/helpers';
import { Token } from 'libs/tokens';
import { sendEvent } from 'services/googleTagManager';

export const InputRange: FC<{
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  token: Token;
  buy?: boolean;
  error?: string;
  setRangeError: (error: string) => void;
}> = ({ min, setMin, max, setMax, token, buy, error, setRangeError }) => {
  const errorMessage = 'Max Price must be higher than min price and not zero';

  const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
    setMin(sanitizeNumberInput(e.target.value));
    if (!max || (+e.target.value > 0 && +max > +e.target.value)) {
      setRangeError('');
    } else {
      sendEvent('strategy', 'strategy_error_show', {
        section: buy ? 'Buy Low' : 'Sell High',
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
      sendEvent('strategy', 'strategy_error_show', {
        section: buy ? 'Buy Low' : 'Sell High',
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
      <div className="flex space-x-6">
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-4 rounded-l-16 border-2 border-black p-16`}
        >
          <Tooltip
            sendEventOnMount={{ section: buy ? 'Buy Low' : 'Sell High' }}
            element={`The lowest price to ${buy ? 'buy' : 'sell'} ${
              token.symbol
            } at.`}
          >
            <div className={'mb-5 text-12 text-white/60'}>Min</div>
          </Tooltip>
          <input
            value={min}
            onChange={handleChangeMin}
            placeholder="Enter Price"
            onFocus={handleFocus}
            className={
              'mb-5 w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="font-mono text-12 text-white/60">
            {getFiatAsString(min)}
          </div>
        </div>
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-16 rounded-l-4 border-2 border-black p-16`}
        >
          <Tooltip
            sendEventOnMount={{ section: buy ? 'Buy Low' : 'Sell High' }}
            element={`The highest price to ${buy ? 'buy' : 'sell'} ${
              token.symbol
            } at.`}
          >
            <div className={'mb-5 text-12 text-white/60'}>Max</div>
          </Tooltip>
          <input
            value={max}
            onChange={handleChangeMax}
            placeholder={`Enter Price`}
            onFocus={handleFocus}
            className={
              'w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="mt-6 font-mono text-12 text-white/60">
            {getFiatAsString(max)}
          </div>
        </div>
      </div>
      <div
        className={`mt-10 h-16 text-center text-12 text-red ${
          !error ? 'invisible' : ''
        }`}
      >
        {error ? error : ''}
      </div>
    </div>
  );
};
