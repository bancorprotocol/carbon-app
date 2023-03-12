import { ChangeEvent, FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { sanitizeNumberInput } from 'utils/helpers';
import { Token } from 'libs/tokens';

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
  const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) =>
    setMin(sanitizeNumberInput(e.target.value));

  const handleChangeMax = (e: ChangeEvent<HTMLInputElement>) =>
    setMax(sanitizeNumberInput(e.target.value));

  const handleBlur = (isMin?: boolean) => {
    Number(min) > 0 && (isMin || Number(max) > Number(min))
      ? setRangeError('')
      : setRangeError('Max Price must be higher than min price and not zero');
  };

  const { getFiatAsString: getFiatAsStringMin } = useFiatCurrency(token, min);
  const { getFiatAsString: getFiatAsStringMax } = useFiatCurrency(token, max);

  return (
    <div>
      <div className="flex space-x-6">
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-4 rounded-l-16 border-2 border-black p-16`}
        >
          <Tooltip
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
            onBlur={() => handleBlur(true)}
            className={
              'mb-5 w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="font-mono text-12 text-white/60">
            {getFiatAsStringMin()}
          </div>
        </div>
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-16 rounded-l-4 border-2 border-black p-16`}
        >
          <Tooltip
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
            onBlur={() => handleBlur()}
            className={
              'w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="mt-6 font-mono text-12 text-white/60">
            {getFiatAsStringMax()}
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
